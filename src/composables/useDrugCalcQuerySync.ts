import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

function toNumber(v: unknown): number | undefined {
  if (v === null || v === undefined || v === '') return undefined
  const value = Array.isArray(v) ? v[0] : v
  const str = String(value).trim()
  if (str === '') return undefined
  const n = Number(str)
  return Number.isFinite(n) ? n : undefined
}

const OD_PREFIX = 'od_'

/** Query key: od_<protocolId>_<lineIndex> — lineIndex is the row in that protocol's otherDrugs array. */
function otherDrugsPctQueryKey(protocolId: string, lineIndex: number): string {
  return `${OD_PREFIX}${protocolId}_${lineIndex}`
}

function parseOtherDrugsPctKey(key: string): { protocolId: string; index: number } | null {
  if (!key.startsWith(OD_PREFIX)) return null
  const rest = key.slice(OD_PREFIX.length)
  const lastUs = rest.lastIndexOf('_')
  if (lastUs <= 0) return null
  const protocolId = rest.slice(0, lastUs)
  const idxStr = rest.slice(lastUs + 1)
  const index = Number.parseInt(idxStr, 10)
  if (!Number.isFinite(index) || index < 0) return null
  return { protocolId, index }
}

function getProtocolsList(store: any): any[] {
  const p = store.protocols
  return Array.isArray(p) ? p : []
}

function applyOtherDrugsFromQuery(q: Record<string, any>, store: any) {
  const list = getProtocolsList(store)
  if (!list.length) return
  for (const key of Object.keys(q)) {
    const parsed = parseOtherDrugsPctKey(key)
    if (!parsed) continue
    const val = toNumber(q[key])
    if (val === undefined) continue
    const proto = list.find((p: { id: string }) => p.id === parsed.protocolId)
    const lines = proto?.otherDrugs
    if (!Array.isArray(lines) || lines[parsed.index] == null) continue
    lines[parsed.index].percentage = val
  }
}

function appendOtherDrugsToQuery(query: Record<string, string>, store: any) {
  const list = getProtocolsList(store)
  for (const proto of list) {
    const lines = proto?.otherDrugs
    if (!Array.isArray(lines) || !lines.length) continue
    lines.forEach((line: { percentage?: number }, idx: number) => {
      const p = line.percentage
      if (p === null || p === undefined) return
      if (typeof p === 'number' && Number.isFinite(p)) {
        query[otherDrugsPctQueryKey(proto.id, idx)] = String(p)
      }
    })
  }
}

function otherDrugsPercentagesSignature(store: any): string {
  const list = getProtocolsList(store)
  return list
    .map((proto) => (proto.otherDrugs ?? []).map((l: { percentage?: number }) => l.percentage ?? '').join(','))
    .join('|')
}

function drugCostQueryKey(drugId: string): string {
  return `dc_${drugId.replace(/-/g, '_')}`
}

function drugIdFromCostQueryKey(key: string): string | null {
  if (!key.startsWith('dc_') || key.length <= 3) return null
  return key.slice(3).replace(/_/g, '-')
}

const LEGACY_DRUG_COST_QUERY_KEYS: Record<string, string> = {
  amoldipine5mgCost: 'amlodipine-5mg',
  losartan50mgCost: 'losartan-50mg',
  hydrochlorothiazide25mgCost: 'hctz-25mg',
  telmisartan40mgCost: 'telmisartan-40mg',
}

function setDrugCost(store: any, drugId: string, value: number | undefined) {
  if (value === undefined) return
  const list = store.drugCatalog
  if (!Array.isArray(list)) return
  const drug = list.find((d: { id: string }) => d.id === drugId)
  if (drug) drug.costPerTablet = value
}

function applyDrugCostsFromQuery(q: Record<string, any>, store: any) {
  const setFromDynamic = new Set<string>()
  for (const key of Object.keys(q)) {
    const drugId = drugIdFromCostQueryKey(key)
    if (!drugId) continue
    const val = toNumber(q[key])
    if (val !== undefined) {
      setDrugCost(store, drugId, val)
      setFromDynamic.add(drugId)
    }
  }
  for (const [legacyKey, drugId] of Object.entries(LEGACY_DRUG_COST_QUERY_KEYS)) {
    if (setFromDynamic.has(drugId)) continue
    if (q[legacyKey] != null && q[legacyKey] !== '') {
      const val = toNumber(q[legacyKey])
      if (val !== undefined) setDrugCost(store, drugId, val)
    }
  }
}

const NUMERIC_KEYS = [
  'forecastMonths',
  'totalPopulation',
  'adultPopulation',
  'prevalenceHTN',
  'patientsUnderCare',
  'targetEnrolment',
  'treatmentAdherence',
] as const

const STRING_KEYS = [
  'currencySymbol',
  'currencySymbolPosition',
  'activeProtocolId',
] as const

const ALL_KEYS = [...NUMERIC_KEYS, ...STRING_KEYS] as const

export function useDrugCalcQuerySync(store: any) {
  const route = useRoute()
  const router = useRouter()

  const refs = storeToRefs(store)

  function applyQueryToStore() {
    const q = route.query
    for (const key of NUMERIC_KEYS) {
      const storeRef = refs[key]
      if (!storeRef) continue
      if (q[key] != null && q[key] !== '') {
        const val = toNumber(q[key])
        if (val !== undefined) storeRef.value = val
      }
    }
    for (const key of STRING_KEYS) {
      const storeRef = refs[key]
      if (!storeRef) continue
      if (q[key] != null && q[key] !== '') {
        const raw = Array.isArray(q[key]) ? q[key][0] : q[key]
        if (typeof raw === 'string') storeRef.value = raw
      }
    }
    applyOtherDrugsFromQuery(q as Record<string, any>, store)
    applyDrugCostsFromQuery(q as Record<string, any>, store)
  }

  applyQueryToStore()

  function pushStoreToUrl() {
    const query: Record<string, string> = {}
    for (const key of ALL_KEYS) {
      const v = refs[key]?.value
      if (v === null || v === undefined || v === '') continue
      if (typeof v === 'number' && !Number.isFinite(v)) continue
      query[key] = String(v)
    }
    appendOtherDrugsToQuery(query, store)

    const catalog = store.drugCatalog
    if (Array.isArray(catalog)) {
      for (const drug of catalog) {
        const c = drug?.costPerTablet
        if (c === null || c === undefined || c === '') continue
        if (typeof c === 'number' && Number.isFinite(c)) {
          query[drugCostQueryKey(drug.id)] = String(c)
        }
      }
    }

    router.replace({ path: route.path, query }).catch(() => {})
  }

  watch(
    () => ({
      static: ALL_KEYS.map((key) => refs[key]?.value),
      otherDrugs: otherDrugsPercentagesSignature(store),
      drugCosts: Array.isArray(store.drugCatalog)
        ? store.drugCatalog.map((d: { costPerTablet?: number }) => d.costPerTablet)
        : [],
    }),
    pushStoreToUrl,
    { deep: true },
  )

  watch(() => route.query, applyQueryToStore, { deep: true })
}
