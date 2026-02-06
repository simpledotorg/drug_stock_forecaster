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

  applyQueryToStore()

  // 2) Store → URL: one watcher for any change → build query and replace
  watch(
    () => QUERY_KEYS.map((key) => refs[key]?.value),
    (values) => {
      const query: Record<string, string> = {}
      values.forEach((v, i) => {
        const key = QUERY_KEYS[i]
        if (v === null || v === undefined || v === '') return
        if (typeof v === 'number' && !Number.isFinite(v)) return
        query[key] = String(v)
      })
      router.replace({ query }).catch(() => {})
    },
    { deep: true }
  )

  // 3) When route query changes (e.g. back/forward), sync into store
  watch(() => route.query, applyQueryToStore, { deep: true })
}
