import { computed } from 'vue'

export function otherDrugsForProtocol(protocol) {
    return protocol?.otherDrugs ?? []
}

export function collectDrugIdsFromLines(lines) {
    const ids = new Set()
    if (!lines) return ids
    for (const line of lines) {
        for (const id of line.drugIds) ids.add(id)
    }
    return ids
}

/** Per-line monthly tablet counts from % of treated patients (30 tabs / patient / month). */
export function forecastLinesForPatients(lines, months, patientsTreated) {
    if (!lines?.length) return []
    return lines.map((line) => {
        const monthly = []
        const pct = line.percentage ?? 0
        for (let i = 0; i < months; i++) {
            const base = patientsTreated[i] ?? 0
            monthly.push(Math.ceil((base * 30 * pct) / 100))
        }
        return {
            label: line.label,
            drugIds: line.drugIds,
            percentage: pct,
            monthly,
            total: monthly.reduce((a, b) => a + b, 0),
        }
    })
}

/**
 * Cost per protocol step and running cumulative, using the same tablet basis as the monthly breakdown:
 * each line’s `total` is attributed in full to every drug on that line when costing (matches
 * aggregateDrugsFromForecastLines).
 */
export function protocolStepCostRows(stepForecasts, drugCatalog, protocolSteps) {
    if (!stepForecasts?.length) return []
    let cumulative = 0
    let blocked = false
    return stepForecasts.map((line, idx) => {
        const step = protocolSteps?.[idx]
        // Display label should be the step label (not the full regimen string).
        const stepLabel = step?.label ?? line.label ?? '—'
        // Keep full regimen available for any downstream consumers, but don't force it into the label.
        const regimen = step?.fullRegimen ?? stepLabel
        const controlAssumptions = step?.percentage ?? line.percentage ?? null
        const T = line.total
        let stepCost = 0
        if (line.drugIds?.length) {
            for (const drugId of line.drugIds) {
                const drug = drugCatalog.find((d) => d.id === drugId)
                const cpt = drug?.costPerTablet
                if (typeof cpt !== 'number' || Number.isNaN(cpt)) {
                    stepCost = null
                    break
                }
                stepCost += Math.ceil(cpt * T)
            }
        }
        let cumulativeCost
        if (stepCost === null) {
            blocked = true
            cumulativeCost = null
        } else if (blocked) {
            cumulativeCost = null
        } else {
            cumulative += stepCost
            cumulativeCost = cumulative
        }
        return {
            index: idx + 1,
            stepLabel,
            regimen,
            controlAssumptions,
            stepCost,
            cumulativeCost,
        }
    })
}

export function aggregateDrugsFromForecastLines(stepForecasts, otherForecasts, drugCatalog, months) {
    const byId = new Map()
    const addLines = (lines) => {
        for (const line of lines) {
            for (const drugId of line.drugIds) {
                if (!byId.has(drugId)) {
                    byId.set(drugId, { monthly: Array.from({ length: months }, () => 0) })
                }
                const entry = byId.get(drugId)
                for (let i = 0; i < line.monthly.length; i++) {
                    entry.monthly[i] += line.monthly[i]
                }
            }
        }
    }
    addLines(stepForecasts)
    addLines(otherForecasts)

    const list = []
    for (const [drugId, { monthly }] of byId) {
        const drug = drugCatalog.find((d) => d.id === drugId)
        const total = monthly.reduce((a, b) => a + b, 0)
        const cpt = drug?.costPerTablet
        const lineCost =
            typeof cpt === 'number' && !Number.isNaN(cpt) ? Math.ceil(cpt * total) : null
        list.push({
            id: drugId,
            name: drug?.name ?? drugId,
            costPerTablet: cpt,
            totalTablets: total,
            monthlyTablets: monthly,
            lineCost,
        })
    }
    list.sort((a, b) => a.name.localeCompare(b.name))
    return list
}

export function dashboardDrugSections(drugForecastList, activeProtocol) {
    const inSteps = collectDrugIdsFromLines(activeProtocol?.steps)
    const inOther = collectDrugIdsFromLines(otherDrugsForProtocol(activeProtocol))
    const byName = (a, b) => a.name.localeCompare(b.name)
    return {
        protocolDrugs: drugForecastList.filter((d) => inSteps.has(d.id)).sort(byName),
        otherOnlyDrugs: drugForecastList.filter((d) => inOther.has(d.id) && !inSteps.has(d.id)).sort(byName),
    }
}

export function buildYearlyBreakdown(
    forecastMonths,
    expectedCumulativeEnrolment,
    patientsTreatedFromAdherence,
    stepForecasts,
    otherDrugForecasts,
) {
    const rows = []
    for (let i = 0; i < forecastMonths; i++) {
        rows.push({
            month: i + 1,
            expectedCumulativeEnrolment: expectedCumulativeEnrolment[i],
            patientsTreatedFromAdherence: patientsTreatedFromAdherence[i],
            stepTablets: stepForecasts.map((s) => s.monthly[i]),
            otherDrugTablets: otherDrugForecasts.map((s) => s.monthly[i]),
        })
    }
    return rows
}

export function drugCostWritable(catalogRef, drugId) {
    return computed({
        get() {
            return catalogRef.value.find((d) => d.id === drugId)?.costPerTablet
        },
        set(v) {
            const d = catalogRef.value.find((x) => x.id === drugId)
            if (d) d.costPerTablet = v
        },
    })
}

export function uniqueDrugIdsFromProtocol(protocol) {
    if (!protocol) return []
    const seen = new Set()
    const ids = []
    const push = (lines) => {
        if (!lines) return
        for (const line of lines) {
            for (const id of line.drugIds) {
                if (!seen.has(id)) {
                    seen.add(id)
                    ids.push(id)
                }
            }
        }
    }
    push(protocol.steps)
    push(otherDrugsForProtocol(protocol))
    return ids
}
