import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { createInitialDrugCatalog, createInitialProtocols } from '../src/stores/treatmentProtocols.js'
import {
  forecastLinesForPatients,
  aggregateDrugsFromForecastLines,
  buildYearlyBreakdown,
  protocolStepCostRows,
  dashboardDrugSections,
} from '../src/stores/drugCalcHelpers.js'

function die(message) {
  console.error(message)
  process.exit(1)
}

function toIntLike(v) {
  if (v === '' || v == null) return null
  const n = Number(String(v).replaceAll(',', '').trim())
  if (!Number.isFinite(n)) return null
  // allow TSV values like 1100, 1100.0
  if (Math.abs(n - Math.round(n)) < 1e-9) return Math.round(n)
  return n
}

function normalizeHeaderKey(s) {
  return String(s ?? '')
    .trim()
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '')
}

function isStepCostTableHeader(headers) {
  const nh = headers.map((h) => normalizeHeaderKey(h))
  if (nh.length < 3) return false
  const stepOk = nh[0] === 'step'
  const costOk = nh[1] === 'stepcost' || nh[1] === 'cost'
  const cumOk =
    nh[2] === 'cumulativecost' || nh[2] === 'cumcost' || nh[2] === 'cumulative' || nh[2] === 'cumulativetotal'
  return stepOk && costOk && cumOk
}

/** Matches `ForecastTable.vue` "By drug": Drug | Tablets | Cost */
function isByDrugTableHeader(headers) {
  const nh = headers.map((h) => normalizeHeaderKey(h))
  if (nh.length < 3) return false
  return nh[0] === 'drug' && nh[1] === 'tablets' && nh[2] === 'cost'
}

function drugCellMatchesFixture(cell, drug) {
  if (!drug) return false
  const s = String(cell ?? '').trim()
  if (s === drug.id) return true
  return normalizeHeaderKey(s) === normalizeHeaderKey(drug.name)
}

function isByDrugSectionLabelRow(cols) {
  return normalizeHeaderKey(cols[0]) === 'otherdrugs'
}

function filterByDrugFixtureRowsForCompare(rows) {
  return rows.filter((cols) => !isByDrugSectionLabelRow(cols))
}

function finalCostFromDrugList(drugs) {
  return drugs.some((d) => d.lineCost === null) ? null : drugs.reduce((s, d) => s + d.lineCost, 0)
}

function parseTsv(text) {
  const raw = text
    .split(/\r?\n/)
    .map((l) => l.trimEnd())
    .filter((l) => l.length > 0 && !l.trimStart().startsWith('#'))

  // Row-based fixture is expected to be a single contiguous TSV table.
  // Stop parsing when we hit an excel-block section (starts with @meta) or an excel-style header row.
  const lines = []
  for (const line of raw) {
    const t = line.trimStart()
    if (t.startsWith('@')) break
    if (t.toLowerCase().startsWith('month\t')) break
    lines.push(line)
  }
  if (!lines.length) return []

  const headers = lines[0].split('\t').map((h) => h.trim())
  const out = []
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split('\t')
    const row = {}
    for (let j = 0; j < headers.length; j++) row[headers[j]] = (cols[j] ?? '').trim()
    out.push(row)
  }
  return out
}

function parseExcelBlocks(text) {
  // Format:
  //   @caseId=excel-example
  //   @protocolId=philippines-htn
  //   @patientsUnderCare=1000
  //   @targetEnrolment=1200
  //   @treatmentAdherence=80
  //   @forecastMonths=12
  //   Calculation breakdown is always fully checked: Month 1..forecastMonths, then Total, then Drug|Tablets|Cost (+ Total), then Step|Step cost|Cumulative cost (same order as the UI).
  //   Month\tCumulative enrolment\tPatients treated\t<step labels>...
  //   Month 1\t...
  //   Total\t...
  //   (blank line)
  //   Drug\tTablets\tCost
  //   ...\t...\t...
  //   Total\t\t22673
  //   (blank line)
  //   Step\tStep cost\tCumulative cost
  //   1\t9648\t9648
  //
  // Multiple blocks can be concatenated; blocks are separated by one or more blank lines.
  const rawLines = text.split(/\r?\n/).map((l) => l.trimEnd())
  const blocks = []
  let i = 0

  const nextNonEmpty = (idx) => {
    while (idx < rawLines.length && rawLines[idx].trim() === '') idx++
    return idx
  }

  i = nextNonEmpty(i)
  while (i < rawLines.length) {
    // Skip comment-only lines
    while (i < rawLines.length && rawLines[i].trimStart().startsWith('#')) i++
    i = nextNonEmpty(i)
    if (i >= rawLines.length) break

    const meta = {}
    while (i < rawLines.length) {
      const line = rawLines[i]
      if (line.trim() === '') {
        i++
        continue
      }
      if (line.trimStart().startsWith('#')) {
        i++
        continue
      }
      if (!line.startsWith('@')) break
      const eq = line.indexOf('=')
      if (eq === -1) die(`Invalid meta line (expected @key=value): "${line}"`)
      const key = line.slice(1, eq).trim()
      const value = line.slice(eq + 1).trim()
      meta[key] = value
      i++
    }

    // Find header row
    while (i < rawLines.length && (rawLines[i].trim() === '' || rawLines[i].trimStart().startsWith('#'))) i++
    if (i >= rawLines.length) break
    const headerLine = rawLines[i]
    const headers = headerLine.split('\t').map((h) => h.trim())
    i++

    const rows = []
    while (i < rawLines.length) {
      const line = rawLines[i]
      if (line.trim() === '') break
      if (line.trimStart().startsWith('#')) {
        i++
        continue
      }
      if (line.startsWith('@')) break // start of next block (after blank lines typically)
      const cols = line.split('\t')
      rows.push(cols.map((c) => (c ?? '').trim()))
      i++
    }

    /** By drug first after monthly breakdown: Drug | Tablets | Cost (matches `ForecastTable.vue` order) */
    let byDrugTableRows = null
    while (i < rawLines.length && (rawLines[i].trim() === '' || rawLines[i].trimStart().startsWith('#'))) i++
    if (i < rawLines.length && !rawLines[i].trimStart().startsWith('@')) {
      const bdHeaderLine = rawLines[i]
      const bdHeaders = bdHeaderLine.split('\t').map((h) => h.trim())
      if (isByDrugTableHeader(bdHeaders)) {
        i++
        byDrugTableRows = []
        while (i < rawLines.length) {
          const line = rawLines[i]
          if (line.trim() === '') break
          if (line.trimStart().startsWith('#')) {
            i++
            continue
          }
          if (line.startsWith('@')) break
          const cols = line.split('\t').map((c) => (c ?? '').trim())
          byDrugTableRows.push(cols)
          i++
        }
      }
    }

    /** Then Step | Step cost | Cumulative cost (Cost by protocol step) */
    let stepCostTableRows = null
    while (i < rawLines.length && (rawLines[i].trim() === '' || rawLines[i].trimStart().startsWith('#'))) i++
    if (i < rawLines.length && !rawLines[i].trimStart().startsWith('@')) {
      const scHeaderLine = rawLines[i]
      const scHeaders = scHeaderLine.split('\t').map((h) => h.trim())
      if (isStepCostTableHeader(scHeaders)) {
        i++
        stepCostTableRows = []
        while (i < rawLines.length) {
          const line = rawLines[i]
          if (line.trim() === '') break
          if (line.trimStart().startsWith('#')) {
            i++
            continue
          }
          if (line.startsWith('@')) break
          const cols = line.split('\t').map((c) => (c ?? '').trim())
          stepCostTableRows.push(cols)
          i++
        }
      }
    }

    blocks.push({ meta, headers, rows, stepCostTableRows, byDrugTableRows })
    i = nextNonEmpty(i)
  }

  return blocks
}

function getRequired(row, key) {
  const v = row[key]
  if (v == null || v === '') die(`Missing required TSV column "${key}" for row: ${JSON.stringify(row)}`)
  return v
}

function overridePercentages(protocol, row) {
  // Optional overrides:
  // - stepPct_1 ... stepPct_12
  // - otherPct_1 ... otherPct_12
  const steps = protocol.steps ?? []
  for (let i = 0; i < steps.length; i++) {
    const key = `stepPct_${i + 1}`
    const raw = row[key]
    if (raw != null && raw !== '') {
      const n = Number(raw)
      if (!Number.isFinite(n)) die(`Invalid ${key}="${raw}" (expected number) for protocolId=${protocol.id}`)
      steps[i].percentage = n
    }
  }
  const other = protocol.otherDrugs ?? []
  for (let i = 0; i < other.length; i++) {
    const key = `otherPct_${i + 1}`
    const raw = row[key]
    if (raw != null && raw !== '') {
      const n = Number(raw)
      if (!Number.isFinite(n)) die(`Invalid ${key}="${raw}" (expected number) for protocolId=${protocol.id}`)
      other[i].percentage = n
    }
  }
}

function overrideDrugCosts(drugCatalog, row) {
  // Optional overrides (either style works):
  // - cost_<drug-id>=0.05  (recommended)
  // - drugCost_<drug-id>=0.05
  for (const [k, v] of Object.entries(row)) {
    if (v == null || v === '') continue
    let id = null
    if (k.startsWith('cost_')) id = k.slice('cost_'.length)
    else if (k.startsWith('drugCost_')) id = k.slice('drugCost_'.length)
    if (!id) continue
    const n = Number(String(v).trim())
    if (!Number.isFinite(n)) die(`Invalid ${k}="${v}" (expected number)`)
    const d = drugCatalog.find((x) => x.id === id)
    if (!d) die(`Unknown drug id in fixture override: ${k} (no drug "${id}")`)
    d.costPerTablet = n
  }
}

function requiredDrugIdsForProtocol(protocol) {
  const ids = new Set()
  const push = (lines) => {
    for (const line of lines ?? []) for (const id of line?.drugIds ?? []) ids.add(id)
  }
  push(protocol?.steps)
  push(protocol?.otherDrugs)
  return Array.from(ids)
}

function assertCostsProvided({ caseId, protocolId, rowLike, requiredDrugIds }) {
  const missing = []
  for (const id of requiredDrugIds) {
    const a = rowLike[`cost_${id}`]
    const b = rowLike[`drugCost_${id}`]
    if ((a == null || a === '') && (b == null || b === "")) missing.push(id)
  }
  if (missing.length) {
    die(
      `Missing required cost overrides for caseId=${caseId} protocolId=${protocolId}: ${missing
        .map((id) => `cost_${id}`)
        .join(', ')}`,
    )
  }
}

function expectedMonthlyEnrolment({ targetEnrolment, forecastMonths }) {
  return Math.ceil(targetEnrolment / forecastMonths)
}

function expectedCumulativeEnrolment({ patientsUnderCare, targetEnrolment, forecastMonths }) {
  const monthly = expectedMonthlyEnrolment({ targetEnrolment, forecastMonths })
  const out = []
  let cumulative = patientsUnderCare
  for (let i = 0; i < forecastMonths; i++) {
    cumulative += monthly
    out.push(cumulative)
  }
  return out
}

function patientsTreatedFromAdherence({ patientsUnderCare, targetEnrolment, treatmentAdherence, forecastMonths }) {
  const monthly = expectedMonthlyEnrolment({ targetEnrolment, forecastMonths })
  const cumulative = expectedCumulativeEnrolment({ patientsUnderCare, targetEnrolment, forecastMonths })
  const out = []
  for (let i = 0; i < forecastMonths; i++) {
    const base = i === 0 ? patientsUnderCare : cumulative[i - 1]
    out.push(Math.ceil((base * treatmentAdherence) / 100 + monthly))
  }
  return out
}

function compareCell({ caseId, protocolId, month, col, expected, actual, failures }) {
  if (expected === null) return
  if (expected !== actual) {
    failures.push({ caseId, protocolId, month, col, expected, actual })
  }
}

/** Parse meta/row value for cost fields; allow `null` literal. */
function toCostAssertValue(v) {
  if (v == null || v === '') return null
  const s = String(v).trim()
  if (s.toLowerCase() === 'null') return null
  return toIntLike(s)
}

/**
 * Assert step cost + cumulative cost (same as `ProtocolStepCostTable.vue` / `protocolStepCostRows`).
 * Keys: stepCost_1..N, cumulativeCost_1..N (1-based step index).
 */
function compareProtocolStepCostFields({ source, stepCostRows, caseId, protocolId, month, failures }) {
  for (const [k, v] of Object.entries(source)) {
    if (v == null || v === '') continue
    const sc = k.match(/^stepCost_(\d+)$/)
    if (sc) {
      const idx = Number(sc[1]) - 1
      const row = stepCostRows[idx]
      const expected = toCostAssertValue(v)
      const actual = row?.stepCost ?? null
      if (expected !== actual) failures.push({ caseId, protocolId, month, col: k, expected, actual })
    }
    const cc = k.match(/^cumulativeCost_(\d+)$/)
    if (cc) {
      const idx = Number(cc[1]) - 1
      const row = stepCostRows[idx]
      const expected = toCostAssertValue(v)
      const actual = row?.cumulativeCost ?? null
      if (expected !== actual) failures.push({ caseId, protocolId, month, col: k, expected, actual })
    }
  }
}

/** Excel blocks must end with Step | Step cost | Cumulative cost (same as UI). */
function requireExcelBlockStepCostTable({ stepCostTableRows, stepCount, caseId, protocolId }) {
  const tableLen = stepCostTableRows?.length ?? 0
  if (tableLen === 0) {
    die(
      `Excel block (caseId=${caseId} protocolId=${protocolId}): after the By drug table, add a step-cost sub-table (header row Step, Step cost, Cumulative cost) with ${stepCount} data rows`,
    )
  }
  if (tableLen !== stepCount) {
    die(
      `Excel block (caseId=${caseId} protocolId=${protocolId}): step cost table has ${tableLen} data rows but protocol has ${stepCount} steps`,
    )
  }
}

function parseStepIndexCell(v) {
  if (v == null) return null
  const m = String(v).trim().match(/(\d+)/)
  return m ? toIntLike(m[1]) : null
}

function compareProtocolStepCostTable({ stepCostTableRows, stepCostRows, caseId, protocolId, failures }) {
  if (stepCostTableRows.length !== stepCostRows.length) {
    die(
      `Step cost table has ${stepCostTableRows.length} data rows but protocol has ${stepCostRows.length} steps (caseId=${caseId} protocolId=${protocolId})`,
    )
  }
  for (let r = 0; r < stepCostTableRows.length; r++) {
    const cols = stepCostTableRows[r]
    if (cols.length < 3) {
      die(`Step cost table row ${r + 1} needs 3 columns (step, step cost, cumulative cost)`)
    }
    const stepNum = parseStepIndexCell(cols[0])
    if (!Number.isInteger(stepNum) || stepNum < 1) {
      die(`Step cost table row ${r + 1}: invalid step "${cols[0]}"`)
    }
    const idx = stepNum - 1
    const computed = stepCostRows[idx]
    const expSc = toCostAssertValue(cols[1])
    const expCc = toCostAssertValue(cols[2])
    const actSc = computed?.stepCost ?? null
    const actCc = computed?.cumulativeCost ?? null
    if (expSc !== actSc) {
      failures.push({
        caseId,
        protocolId,
        month: 0,
        col: `step-cost table row ${stepNum} stepCost`,
        expected: expSc,
        actual: actSc,
      })
    }
    if (expCc !== actCc) {
      failures.push({
        caseId,
        protocolId,
        month: 0,
        col: `step-cost table row ${stepNum} cumulativeCost`,
        expected: expCc,
        actual: actCc,
      })
    }
  }
}

/** Excel blocks must include By drug (Drug | Tablets | Cost) + Total row, same as `ForecastTable.vue`. */
function requireExcelBlockByDrugTable({ byDrugTableRows, drugRowCount, caseId, protocolId }) {
  const filtered = filterByDrugFixtureRowsForCompare(byDrugTableRows ?? [])
  if (!byDrugTableRows?.length) {
    die(
      `Excel block (caseId=${caseId} protocolId=${protocolId}): after the calculation breakdown Total row, add a By drug sub-table (header Drug, Tablets, Cost) with one row per forecast drug (optional "Other drugs" section row when the UI shows it), ending with a Total row for final cost`,
    )
  }
  const last = filtered[filtered.length - 1]
  if (!last || !isProtocolStepTotalsRowLabel(last[0])) {
    die(
      `Excel block (caseId=${caseId} protocolId=${protocolId}): By drug table must end with a Total row (final cost in the Cost column)`,
    )
  }
  if (filtered.length !== drugRowCount + 1) {
    die(
      `Excel block (caseId=${caseId} protocolId=${protocolId}): By drug table has ${filtered.length - 1} data row(s) (excluding "Other drugs" labels) but expected ${drugRowCount} drug row(s) plus one Total row`,
    )
  }
}

function compareProtocolByDrugTable({ byDrugTableRows, drugs, protocol, caseId, protocolId, failures }) {
  const { protocolDrugs, otherOnlyDrugs } = dashboardDrugSections(drugs, protocol)
  const ordered = [...protocolDrugs, ...otherOnlyDrugs]
  const filtered = filterByDrugFixtureRowsForCompare(byDrugTableRows)
  const totalRow = filtered[filtered.length - 1]
  const dataRows = filtered.slice(0, -1)
  for (let r = 0; r < dataRows.length; r++) {
    const cols = dataRows[r]
    if (cols.length < 3) {
      die(`By drug table row ${r + 1}: need 3 columns (Drug, Tablets, Cost) (caseId=${caseId} protocolId=${protocolId})`)
    }
    const drug = ordered[r]
    if (!drugCellMatchesFixture(cols[0], drug)) {
      failures.push({
        caseId,
        protocolId,
        month: 0,
        col: `by-drug row ${r + 1} drug`,
        expected: drug ? `${drug.id} / ${drug.name}` : '(missing)',
        actual: cols[0],
      })
    }
    const expTab = toIntLike(cols[1])
    const actTab = drug?.totalTablets ?? 0
    if (expTab !== actTab) {
      failures.push({ caseId, protocolId, month: 0, col: `by-drug row ${r + 1} tablets`, expected: expTab, actual: actTab })
    }
    const expCost = toCostAssertValue(cols[2])
    const actCost = drug?.lineCost ?? null
    if (expCost !== actCost) {
      failures.push({ caseId, protocolId, month: 0, col: `by-drug row ${r + 1} cost`, expected: expCost, actual: actCost })
    }
  }
  const costCell = totalRow.length >= 3 ? totalRow[2] : totalRow[1]
  const expFinal = toCostAssertValue(costCell)
  const actFinal = finalCostFromDrugList(drugs)
  if (expFinal !== actFinal) {
    failures.push({ caseId, protocolId, month: 0, col: 'by-drug Total cost', expected: expFinal, actual: actFinal })
  }
}

function runRowFixture({ rows, protocols, drugCatalog, failures }) {
  for (const row of rows) {
    const caseId = getRequired(row, 'caseId')
    const protocolId = getRequired(row, 'protocolId')
    const month = toIntLike(getRequired(row, 'month'))
    if (!Number.isInteger(month) || month < 1)
      die(`Invalid month="${row.month}" for caseId=${caseId} protocolId=${protocolId}`)

    const patientsUnderCare = toIntLike(getRequired(row, 'patientsUnderCare'))
    const targetEnrolment = toIntLike(getRequired(row, 'targetEnrolment'))
    const treatmentAdherence = toIntLike(getRequired(row, 'treatmentAdherence'))
    const forecastMonths = toIntLike(getRequired(row, 'forecastMonths'))

    if (![patientsUnderCare, targetEnrolment, treatmentAdherence, forecastMonths].every((n) => typeof n === 'number')) {
      die(`Invalid numeric inputs for caseId=${caseId} protocolId=${protocolId}`)
    }

    const baseProtocol = protocols.find((p) => p.id === protocolId)
    if (!baseProtocol) die(`Unknown protocolId="${protocolId}" for caseId=${caseId}`)
    const protocol = structuredClone(baseProtocol)
    overridePercentages(protocol, row)

    assertCostsProvided({
      caseId,
      protocolId,
      rowLike: row,
      requiredDrugIds: requiredDrugIdsForProtocol(protocol),
    })
    const catalog = structuredClone(drugCatalog)
    overrideDrugCosts(catalog, row)

    const monthly = expectedMonthlyEnrolment({ targetEnrolment, forecastMonths })
    const cumulative = expectedCumulativeEnrolment({ patientsUnderCare, targetEnrolment, forecastMonths })
    const treated = patientsTreatedFromAdherence({
      patientsUnderCare,
      targetEnrolment,
      treatmentAdherence,
      forecastMonths,
    })

    const mIdx = month - 1
    if (mIdx >= forecastMonths)
      die(`Row month=${month} exceeds forecastMonths=${forecastMonths} for caseId=${caseId}`)

    const stepForecasts = forecastLinesForPatients(protocol.steps ?? [], forecastMonths, treated)
    const otherForecasts = forecastLinesForPatients(protocol.otherDrugs ?? [], forecastMonths, treated)
    const stepCostRows = protocolStepCostRows(stepForecasts, catalog, protocol.steps ?? [])
    const drugs = aggregateDrugsFromForecastLines(stepForecasts, otherForecasts, catalog, forecastMonths)
    const yearly = buildYearlyBreakdown(forecastMonths, cumulative, treated, stepForecasts, otherForecasts)

    compareProtocolStepCostFields({ source: row, stepCostRows, caseId, protocolId, month, failures })

    compareCell({
      caseId,
      protocolId,
      month,
      col: 'expectedNewEnrolments',
      expected: toIntLike(row.expectedNewEnrolments),
      actual: monthly,
      failures,
    })
    compareCell({
      caseId,
      protocolId,
      month,
      col: 'expectedCumulativeEnrolment',
      expected: toIntLike(row.expectedCumulativeEnrolment),
      actual: cumulative[mIdx],
      failures,
    })
    compareCell({
      caseId,
      protocolId,
      month,
      col: 'patientsTreated',
      expected: toIntLike(row.patientsTreated),
      actual: treated[mIdx],
      failures,
    })

    for (let i = 0; i < 12; i++) {
      const key = `stepTablets_${i + 1}`
      if (row[key] == null || row[key] === '') continue
      compareCell({
        caseId,
        protocolId,
        month,
        col: key,
        expected: toIntLike(row[key]),
        actual: stepForecasts[i]?.monthly?.[mIdx] ?? 0,
        failures,
      })
    }
    for (let i = 0; i < 12; i++) {
      const key = `otherTablets_${i + 1}`
      if (row[key] == null || row[key] === '') continue
      compareCell({
        caseId,
        protocolId,
        month,
        col: key,
        expected: toIntLike(row[key]),
        actual: otherForecasts[i]?.monthly?.[mIdx] ?? 0,
        failures,
      })
    }

    for (const [k, v] of Object.entries(row)) {
      if (!k.startsWith('drug_') || v === '') continue
      const id = k.slice('drug_'.length)
      const entry = drugs.find((d) => d.id === id)
      compareCell({
        caseId,
        protocolId,
        month,
        col: k,
        expected: toIntLike(v),
        actual: entry?.monthlyTablets?.[mIdx] ?? 0,
        failures,
      })
    }

    // Optional: assert per-drug costs and totals (only if you provide columns)
    for (const [k, v] of Object.entries(row)) {
      if (v === '') continue
      if (k.startsWith('drugLineCost_')) {
        const id = k.slice('drugLineCost_'.length)
        const entry = drugs.find((d) => d.id === id)
        compareCell({
          caseId,
          protocolId,
          month,
          col: k,
          expected: toIntLike(v),
          actual: entry?.lineCost ?? null,
          failures,
        })
      }
      if (k.startsWith('drugTotalTablets_')) {
        const id = k.slice('drugTotalTablets_'.length)
        const entry = drugs.find((d) => d.id === id)
        compareCell({
          caseId,
          protocolId,
          month,
          col: k,
          expected: toIntLike(v),
          actual: entry?.totalTablets ?? 0,
          failures,
        })
      }
    }
    if (row.totalCost !== '' && row.totalCost != null) {
      const totalCost = drugs.some((d) => d.lineCost === null) ? null : drugs.reduce((s, d) => s + d.lineCost, 0)
      compareCell({
        caseId,
        protocolId,
        month,
        col: 'totalCost',
        expected: toIntLike(row.totalCost),
        actual: totalCost,
        failures,
      })
    }

    compareCell({
      caseId,
      protocolId,
      month,
      col: 'yearly_expectedCumulativeEnrolment',
      expected: toIntLike(row.yearly_expectedCumulativeEnrolment),
      actual: yearly[mIdx]?.expectedCumulativeEnrolment,
      failures,
    })
    compareCell({
      caseId,
      protocolId,
      month,
      col: 'yearly_patientsTreatedFromAdherence',
      expected: toIntLike(row.yearly_patientsTreatedFromAdherence),
      actual: yearly[mIdx]?.patientsTreatedFromAdherence,
      failures,
    })
  }
}

function normalizeMonthCell(v) {
  // Accept "Month 1", "1", "01"
  if (v == null) return null
  const s = String(v).trim()
  const m = s.match(/(\d+)/)
  if (!m) return null
  return toIntLike(m[1])
}

function isProtocolStepTotalsRowLabel(v) {
  // Matches the breakdown table row labeled "Total" (year sum per step / other line).
  return String(v ?? '')
    .trim()
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '') === 'total'
}

function runExcelBlockFixture({ blocks, protocols, drugCatalog, failures }) {
  // These match the `CalculationBreakdown.vue` table columns.
  const CORE = {
    month: new Set([normalizeHeaderKey('Month')]),
    cumulative: new Set([normalizeHeaderKey('Cumulative enrolment'), normalizeHeaderKey('Cumulative enrollment')]),
    treated: new Set([normalizeHeaderKey('Patients treated'), normalizeHeaderKey('Patient treated')]),
  }

  for (const block of blocks) {
    const meta = block.meta ?? {}
    // If the file isn't using @meta, ignore as "not excel blocks"
    if (!Object.keys(meta).length) continue

    const caseId = meta.caseId ?? 'excel-block'
    const protocolId = meta.protocolId
    if (!protocolId) die(`Excel block missing @protocolId (caseId=${caseId})`)

    const patientsUnderCare = toIntLike(meta.patientsUnderCare)
    const targetEnrolment = toIntLike(meta.targetEnrolment)
    const treatmentAdherence = toIntLike(meta.treatmentAdherence)
    const forecastMonths = toIntLike(meta.forecastMonths)
    if (![patientsUnderCare, targetEnrolment, treatmentAdherence, forecastMonths].every((n) => typeof n === 'number')) {
      die(`Excel block has invalid numeric @meta (caseId=${caseId} protocolId=${protocolId})`)
    }

    const baseProtocol = protocols.find((p) => p.id === protocolId)
    if (!baseProtocol) die(`Unknown protocolId="${protocolId}" for caseId=${caseId}`)
    const protocol = structuredClone(baseProtocol)

    // Optional % overrides in @meta: stepPct_1=..., otherPct_1=...
    overridePercentages(protocol, meta)

    const catalog = structuredClone(drugCatalog)
    // Optional cost overrides in @meta:
    // - cost_<drug-id>=0.05
    // - drugCost_<drug-id>=0.05
    // Also supports @totalCost=<number|null> and @drugLineCost_<drug-id>=... style assertions (see below).
    assertCostsProvided({
      caseId,
      protocolId,
      rowLike: meta,
      requiredDrugIds: requiredDrugIdsForProtocol(protocol),
    })
    overrideDrugCosts(catalog, meta)

    const monthly = expectedMonthlyEnrolment({ targetEnrolment, forecastMonths })
    const cumulative = expectedCumulativeEnrolment({ patientsUnderCare, targetEnrolment, forecastMonths })
    const treated = patientsTreatedFromAdherence({
      patientsUnderCare,
      targetEnrolment,
      treatmentAdherence,
      forecastMonths,
    })
    const stepForecasts = forecastLinesForPatients(protocol.steps ?? [], forecastMonths, treated)
    const otherForecasts = forecastLinesForPatients(protocol.otherDrugs ?? [], forecastMonths, treated)
    const stepCostRows = protocolStepCostRows(stepForecasts, catalog, protocol.steps ?? [])
    const drugs = aggregateDrugsFromForecastLines(stepForecasts, otherForecasts, catalog, forecastMonths)

    const dashboardSections = dashboardDrugSections(drugs, protocol)
    const byDrugDataRowCount = dashboardSections.protocolDrugs.length + dashboardSections.otherOnlyDrugs.length
    requireExcelBlockByDrugTable({
      byDrugTableRows: block.byDrugTableRows,
      drugRowCount: byDrugDataRowCount,
      caseId,
      protocolId,
    })
    compareProtocolByDrugTable({
      byDrugTableRows: block.byDrugTableRows,
      drugs,
      protocol,
      caseId,
      protocolId,
      failures,
    })

    requireExcelBlockStepCostTable({
      stepCostTableRows: block.stepCostTableRows,
      stepCount: stepCostRows.length,
      caseId,
      protocolId,
    })
    compareProtocolStepCostTable({
      stepCostTableRows: block.stepCostTableRows,
      stepCostRows,
      caseId,
      protocolId,
      failures,
    })

    // Optional cost / total-by-drug assertions via @meta (full-year, not month rows):
    // - @totalCost=123456
    // - @drugLineCost_<drug-id>=...
    // - @drugTotalTablets_<drug-id>=N  (optional — per-drug year tablets; omit if breakdown "Total" row is used)
    if (meta.totalCost != null && meta.totalCost !== '') {
      const totalCost = drugs.some((d) => d.lineCost === null) ? null : drugs.reduce((s, d) => s + d.lineCost, 0)
      const expected = meta.totalCost === 'null' ? null : toIntLike(meta.totalCost)
      if (expected !== totalCost) failures.push({ caseId, protocolId, month: 0, col: 'totalCost', expected, actual: totalCost })
    }
    for (const [k, v] of Object.entries(meta)) {
      if (v == null || v === '') continue
      if (k.startsWith('drugLineCost_')) {
        const id = k.slice('drugLineCost_'.length)
        const entry = drugs.find((d) => d.id === id)
        const expected = v === 'null' ? null : toIntLike(v)
        const actual = entry?.lineCost ?? null
        if (expected !== actual) failures.push({ caseId, protocolId, month: 0, col: k, expected, actual })
      }
      if (k.startsWith('drugTotalTablets_')) {
        const id = k.slice('drugTotalTablets_'.length)
        const entry = drugs.find((d) => d.id === id)
        const expected = toIntLike(v)
        const actual = entry?.totalTablets ?? 0
        if (expected !== actual) failures.push({ caseId, protocolId, month: 0, col: k, expected, actual })
      }
    }

    // Map excel header -> app comparison key (core) or step/other by label
    const excelHeaders = block.headers ?? []
    if (!excelHeaders.length) die(`Excel block missing header row (caseId=${caseId} protocolId=${protocolId})`)

    const normHeaders = excelHeaders.map((h) => normalizeHeaderKey(h))
    const expectedStepLabels = (protocol.steps ?? []).map((s) => normalizeHeaderKey(s?.label ?? ''))
    const expectedOtherLabels = (protocol.otherDrugs ?? []).map((s) => normalizeHeaderKey(s?.label ?? ''))

    // Enforce that the pasted table matches the UI column layout exactly:
    // Month | Cumulative enrolment | Patients treated | (steps...) | (other drugs...)
    const expectedTotalCols = 3 + expectedStepLabels.length + expectedOtherLabels.length
    if (excelHeaders.length !== expectedTotalCols) {
      die(
        `Excel block (caseId=${caseId} protocolId=${protocolId}) has ${excelHeaders.length} columns but expected ${expectedTotalCols} ` +
          `(3 core + ${expectedStepLabels.length} step(s) + ${expectedOtherLabels.length} other-drug line(s)).`,
      )
    }
    if (!CORE.month.has(normHeaders[0])) {
      die(`Excel block (caseId=${caseId} protocolId=${protocolId}) first column must be "Month" (got "${excelHeaders[0]}")`)
    }
    if (!CORE.cumulative.has(normHeaders[1])) {
      die(
        `Excel block (caseId=${caseId} protocolId=${protocolId}) second column must be "Cumulative enrolment" (got "${excelHeaders[1]}")`,
      )
    }
    if (!CORE.treated.has(normHeaders[2])) {
      die(
        `Excel block (caseId=${caseId} protocolId=${protocolId}) third column must be "Patients treated" (got "${excelHeaders[2]}")`,
      )
    }
    for (let i = 0; i < expectedStepLabels.length; i++) {
      const got = normHeaders[3 + i]
      const exp = expectedStepLabels[i]
      if (!exp) die(`Protocol step ${i + 1} missing label (protocolId=${protocolId})`)
      if (got !== exp) {
        const wantRaw = protocol.steps?.[i]?.label ?? `Step ${i + 1}`
        die(
          `Excel block (caseId=${caseId} protocolId=${protocolId}) step column ${i + 1} must be "${wantRaw}" (got "${excelHeaders[3 + i]}")`,
        )
      }
    }
    for (let i = 0; i < expectedOtherLabels.length; i++) {
      const got = normHeaders[3 + expectedStepLabels.length + i]
      const exp = expectedOtherLabels[i]
      if (!exp) die(`Other-drug line ${i + 1} missing label (protocolId=${protocolId})`)
      if (got !== exp) {
        const wantRaw = protocol.otherDrugs?.[i]?.label ?? `Other ${i + 1}`
        die(
          `Excel block (caseId=${caseId} protocolId=${protocolId}) other-drug column ${i + 1} must be "${wantRaw}" (got "${excelHeaders[3 + expectedStepLabels.length + i]}")`,
        )
      }
    }

    const breakdownRows = block.rows ?? []
    const expectedBreakdownLen = forecastMonths + 1
    if (breakdownRows.length !== expectedBreakdownLen) {
      die(
        `Excel block (caseId=${caseId} protocolId=${protocolId}): calculation breakdown must be exactly ${forecastMonths} month rows plus 1 Total row (${expectedBreakdownLen} data rows), got ${breakdownRows.length}`,
      )
    }
    for (let i = 0; i < forecastMonths; i++) {
      const m = normalizeMonthCell(breakdownRows[i]?.[0])
      if (m !== i + 1) {
        die(
          `Excel block (caseId=${caseId} protocolId=${protocolId}): breakdown row ${i + 2} after header must be Month ${i + 1}, got "${breakdownRows[i]?.[0] ?? ''}"`,
        )
      }
    }
    if (!isProtocolStepTotalsRowLabel(breakdownRows[forecastMonths]?.[0])) {
      die(
        `Excel block (caseId=${caseId} protocolId=${protocolId}): last breakdown row must be "Total" (year sums per step / other column)`,
      )
    }

    let assertedCells = 0

    for (const cols of breakdownRows) {
      const monthRaw = cols[0]

      // "Total by protocol step" row (`CalculationBreakdown.vue` yellow row): year sum per step / other line (cols 1–2 blank or placeholders e.g. "-").
      if (isProtocolStepTotalsRowLabel(monthRaw)) {
        for (let i = 0; i < expectedStepLabels.length; i++) {
          compareCell({
            caseId,
            protocolId,
            month: 'Total',
            col: `Total by protocol step — Step ${i + 1}: ${protocol.steps?.[i]?.label ?? ''}`,
            expected: toIntLike(cols[3 + i]),
            actual: stepForecasts[i]?.total ?? 0,
            failures,
          })
          assertedCells++
        }
        for (let i = 0; i < expectedOtherLabels.length; i++) {
          compareCell({
            caseId,
            protocolId,
            month: 'Total',
            col: `Total by protocol step — Other line ${i + 1}: ${protocol.otherDrugs?.[i]?.label ?? ''}`,
            expected: toIntLike(cols[3 + expectedStepLabels.length + i]),
            actual: otherForecasts[i]?.total ?? 0,
            failures,
          })
          assertedCells++
        }
        continue
      }

      const m = normalizeMonthCell(monthRaw)
      if (!Number.isInteger(m) || m < 1) {
        die(`Excel block row has invalid Month="${monthRaw ?? ''}" (caseId=${caseId} protocolId=${protocolId})`)
      }
      const mIdx = m - 1
      if (mIdx >= forecastMonths) {
        die(`Excel block row month=${m} exceeds forecastMonths=${forecastMonths} (caseId=${caseId} protocolId=${protocolId})`)
      }

      compareCell({
        caseId,
        protocolId,
        month: m,
        col: 'Cumulative enrolment',
        expected: toIntLike(cols[1]),
        actual: cumulative[mIdx],
        failures,
      })
      assertedCells++
      compareCell({
        caseId,
        protocolId,
        month: m,
        col: 'Patients treated',
        expected: toIntLike(cols[2]),
        actual: treated[mIdx],
        failures,
      })
      assertedCells++

      // Step columns (must all be present + non-empty)
      for (let i = 0; i < expectedStepLabels.length; i++) {
        compareCell({
          caseId,
          protocolId,
          month: m,
          col: `Step ${i + 1}: ${protocol.steps?.[i]?.label ?? ''}`,
          expected: toIntLike(cols[3 + i]),
          actual: stepForecasts[i]?.monthly?.[mIdx] ?? 0,
          failures,
        })
        assertedCells++
      }
      for (let i = 0; i < expectedOtherLabels.length; i++) {
        compareCell({
          caseId,
          protocolId,
          month: m,
          col: `Other ${i + 1}: ${protocol.otherDrugs?.[i]?.label ?? ''}`,
          expected: toIntLike(cols[3 + expectedStepLabels.length + i]),
          actual: otherForecasts[i]?.monthly?.[mIdx] ?? 0,
          failures,
        })
        assertedCells++
      }
    }

    if (assertedCells === 0) {
      die(
        `Excel block (caseId=${caseId} protocolId=${protocolId}) did not assert any cells. Check your column headers match the expected ones (or match protocol step labels).`,
      )
    }
  }
}

function main() {
  const fixturePath = process.argv[2] ?? 'tests/fixtures/protocol-calcs.tsv'
  const abs = path.resolve(process.cwd(), fixturePath)
  if (!fs.existsSync(abs)) die(`Fixture not found: ${abs}`)
  const text = fs.readFileSync(abs, 'utf8')
  const rows = parseTsv(text)
  const blocks = parseExcelBlocks(text)
  if (!rows.length && !blocks.length) die(`No rows found in fixture: ${abs}`)

  const protocols = createInitialProtocols()
  const drugCatalog = createInitialDrugCatalog()

  const failures = []

  // 1) Row fixture format (existing)
  runRowFixture({ rows, protocols, drugCatalog, failures })
  // 2) Excel block format (new; can paste almost directly from spreadsheet)
  runExcelBlockFixture({ blocks, protocols, drugCatalog, failures })

  if (failures.length) {
    console.error(`Calculation verification failed (${failures.length} mismatch${failures.length === 1 ? '' : 'es'}).`)
    for (const f of failures.slice(0, 50)) {
      console.error(
        `- caseId=${f.caseId} protocolId=${f.protocolId} month=${f.month} col=${f.col}: expected=${f.expected} actual=${f.actual}`,
      )
    }
    if (failures.length > 50) console.error(`... plus ${failures.length - 50} more`)
    process.exit(1)
  }

  const excelRows = blocks.reduce((s, b) => s + (b?.rows?.length ?? 0), 0)
  console.log(
    `OK: calculations match fixture (${rows.length} row${rows.length === 1 ? '' : 's'}; ${excelRows} excel-row${excelRows === 1 ? '' : 's'}).`,
  )
}

main()

