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

const NUMERIC_KEYS = [
  'forecastMonths',
  'totalPopulation',
  'adultPopulation',
  'prevalenceHTN',
  'patientsUnderCare',
  'targetEnrolment',
  'treatmentAdherence',
  'amoldipine5mgCost',
  'losartan50mgCost',
  'hydrochlorothiazide25mgCost',
] as const

const STRING_KEYS = [
  'currencySymbol',
  'currencySymbolPosition',
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
    router.replace({ path: route.path, query }).catch(() => {})
  }

  watch(
    () => ALL_KEYS.map((key) => refs[key]?.value),
    pushStoreToUrl,
    { deep: true }
  )

  watch(() => route.query, applyQueryToStore, { deep: true })
}
