import { ref, computed } from 'vue'

export function createInputsModule() {
  const totalPopulation = ref()
  const adultPopulation = ref()
  const prevalenceHTN = ref()
  const patientsUnderCare = ref(200000)
  const targetEnrolment = ref(8000)
  const treatmentAdherence = ref(65)
  const forecastMonths = ref(12)
  const currencySymbol = ref('₱')
  const currencySymbolPosition = ref('start')

  const estimatedHTNPopulation = computed(() => {
    return (totalPopulation.value * adultPopulation.value) / 100 * (prevalenceHTN.value / 100)
  })

  const htnCoverage = computed(() => {
    return (patientsUnderCare.value / estimatedHTNPopulation.value) * 100
  })

  const estimatedMonthlyEnrolment = computed(() => {
    return Math.ceil(targetEnrolment.value / forecastMonths.value)
  })

  const totalAdultPopulation = computed(() => {
    return (totalPopulation.value * adultPopulation.value) / 100
  })

  const expectedCumulativeEnrolment = computed(() => {
    if (!estimatedMonthlyEnrolment.value) return []
    const out = []
    let cumulative = patientsUnderCare.value
    for (let i = 0; i < forecastMonths.value; i++) {
      cumulative += estimatedMonthlyEnrolment.value
      out.push(cumulative)
    }
    return out
  })

  const patientsTreatedFromAdherence = computed(() => {
    const out = []
    for (let i = 0; i < forecastMonths.value; i++) {
      if (i === 0) {
        out.push(
          Math.ceil(
            (patientsUnderCare.value * treatmentAdherence.value) / 100 + estimatedMonthlyEnrolment.value,
          ),
        )
      } else {
        out.push(
          Math.ceil(
            (expectedCumulativeEnrolment.value[i - 1] * treatmentAdherence.value) / 100 +
              estimatedMonthlyEnrolment.value,
          ),
        )
      }
    }
    return out
  })

  const isNumber = (v) => typeof v === 'number' && !Number.isNaN(v)
  const inputsComplete = computed(
    () =>
      isNumber(totalPopulation.value) &&
      isNumber(adultPopulation.value) &&
      isNumber(prevalenceHTN.value) &&
      isNumber(patientsUnderCare.value) &&
      isNumber(targetEnrolment.value) &&
      isNumber(treatmentAdherence.value),
  )

  return {
    totalPopulation,
    adultPopulation,
    prevalenceHTN,
    patientsUnderCare,
    targetEnrolment,
    treatmentAdherence,
    forecastMonths,
    currencySymbol,
    currencySymbolPosition,
    estimatedHTNPopulation,
    htnCoverage,
    estimatedMonthlyEnrolment,
    totalAdultPopulation,
    expectedCumulativeEnrolment,
    patientsTreatedFromAdherence,
    inputsComplete,
  }
}

