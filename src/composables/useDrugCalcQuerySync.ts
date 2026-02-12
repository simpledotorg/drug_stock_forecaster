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

const QUERY_KEYS = [
  'totalPopulation',
  'adultPopulation',
  'prevalenceHTN',
  'existingPatients',
  'targetEnrolment',
  'treatmentAdherence',
  'amoldipine5mgCost',
  'losartan50mgCost',
  'hydrochlorothiazide25mgCost',
] as const

export function useDrugCalcQuerySync(store: any) {
  const route = useRoute()
  const router = useRouter()

  const refs = storeToRefs(store)

  // 1) URL → store: run once on init (and when route query changes, e.g. back/forward)
  function applyQueryToStore() {
    const q = route.query
    for (const key of QUERY_KEYS) {
      const storeRef = refs[key]
      if (!storeRef) continue
      if (q[key] != null && q[key] !== '') {
        const val = toNumber(q[key])
        if (val !== undefined) storeRef.value = val
      }
    }
  }

  // First load: URL → store (populate inputs from query params)
  applyQueryToStore()

  // After initial load: store → URL when user changes any input
  function pushStoreToUrl() {
    const query: Record<string, string> = {}
    for (let i = 0; i < QUERY_KEYS.length; i++) {
      const key = QUERY_KEYS[i]
      const v = refs[key]?.value
      if (v === null || v === undefined || v === '') continue
      if (typeof v === 'number' && !Number.isFinite(v)) continue
      query[key] = String(v)
    }
    router.replace({ path: route.path, query }).catch(() => {})
  }

  watch(
    () => QUERY_KEYS.map((key) => refs[key]?.value),
    pushStoreToUrl,
    { deep: true }
  )

  // 3) When route query changes (e.g. back/forward), sync into store
  watch(() => route.query, applyQueryToStore, { deep: true })
}
