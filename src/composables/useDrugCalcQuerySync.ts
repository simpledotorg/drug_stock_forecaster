import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRouteQuery } from '@vueuse/router'
import { storeToRefs } from 'pinia'

function toNumber(v: unknown, fallback: number) {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

export function useDrugCalcQuerySync(store: any) {
  const route = useRoute()
  const hydrated = ref(false)
  // Turn store fields into refs (so .value works)
  const {
    totalPopulation,
    adultPopulation,
    prevalenceHTN,
    existingPatients,
    targetEnrolment,
    treatmentAdherence,
  } = storeToRefs(store)

  // Query refs (strings in URL)
  const qTotal = useRouteQuery('totalPopulation', undefined, { mode: 'replace' })
  const qAdult = useRouteQuery('adultPopulation', undefined, { mode: 'replace' })
  const qPrev  = useRouteQuery('prevalenceHTN', undefined, { mode: 'replace' })
  const qExist = useRouteQuery('existingPatients', undefined, { mode: 'replace' })
  const qEnrol = useRouteQuery('targetEnrolment', undefined, { mode: 'replace' })
  const qAdh   = useRouteQuery('treatmentAdherence', undefined, { mode: 'replace' })

  // 1) URL -> store (once)
  onMounted(() => {
    console.log(route.query);
    
    const q = route.query
    console.log(q)
    if (q.totalPopulation != null) totalPopulation.value = toNumber(q.totalPopulation, totalPopulation.value)
    if (q.adultPopulation != null) adultPopulation.value = toNumber(q.adultPopulation, adultPopulation.value)
    if (q.prevalenceHTN != null) prevalenceHTN.value = toNumber(q.prevalenceHTN, prevalenceHTN.value)
    if (q.existingPatients != null) existingPatients.value = toNumber(q.existingPatients, existingPatients.value)
    if (q.targetEnrolment != null) targetEnrolment.value = toNumber(q.targetEnrolment, targetEnrolment.value)
    if (q.treatmentAdherence != null) treatmentAdherence.value = toNumber(q.treatmentAdherence, treatmentAdherence.value)

    hydrated.value = true
  })

  // 2) store -> URL (after hydration)
  watch(
    () => [
      totalPopulation.value,
      adultPopulation.value,
      prevalenceHTN.value,
      existingPatients.value,
      targetEnrolment.value,
      treatmentAdherence.value,
    ],
    () => {
      if (!hydrated.value) return

      qTotal.value = String(totalPopulation.value)
      qAdult.value = String(adultPopulation.value)
      qPrev.value  = String(prevalenceHTN.value)
      qExist.value = String(existingPatients.value)
      qEnrol.value = String(targetEnrolment.value)
      qAdh.value   = String(treatmentAdherence.value)
    },
    { immediate: true },
  )
}
