import { computed } from 'vue'
import { forecastLinesForPatients, aggregateDrugsFromForecastLines, dashboardDrugSections, buildYearlyBreakdown } from '../../utils/forecastMath'

export function createForecastPipelineModule({ forecastMonths, patientsTreatedFromAdherence, activeProtocol, drugCatalog, expectedCumulativeEnrolment }) {
  const stepForecasts = computed(() => {
    const protocol = activeProtocol.value
    if (!protocol?.steps?.length) return []
    return forecastLinesForPatients(protocol.steps, forecastMonths.value, patientsTreatedFromAdherence.value)
  })

  const otherDrugForecasts = computed(() => {
    const lines = activeProtocol.value?.otherDrugs ?? []
    if (!lines.length) return []
    return forecastLinesForPatients(lines, forecastMonths.value, patientsTreatedFromAdherence.value)
  })

  const drugForecastList = computed(() =>
    aggregateDrugsFromForecastLines(
      stepForecasts.value,
      otherDrugForecasts.value,
      drugCatalog.value,
      forecastMonths.value,
    ),
  )

  const dashboardDrugSectionsComputed = computed(() => dashboardDrugSections(drugForecastList.value, activeProtocol.value))

  const totalTabletsAllForecastDrugs = computed(() => drugForecastList.value.reduce((s, d) => s + d.totalTablets, 0))

  const finalCost = computed(() => {
    const list = drugForecastList.value
    if (!list.length) return null
    if (list.some((d) => d.lineCost === null)) return null
    return list.reduce((s, d) => s + d.lineCost, 0)
  })

  const totalCostForYearForecast = finalCost

  const costForYearForecast = computed(() => {
    const o = {}
    for (const d of drugForecastList.value) o[d.id] = d.lineCost
    return o
  })

  const tabletsForYearForecast = computed(() => {
    const o = {}
    for (const d of drugForecastList.value) o[d.id] = d.totalTablets
    return o
  })

  const yearlyBreakdown = computed(() =>
    buildYearlyBreakdown(
      forecastMonths.value,
      expectedCumulativeEnrolment.value,
      patientsTreatedFromAdherence.value,
      stepForecasts.value,
      otherDrugForecasts.value,
    ),
  )

  return {
    stepForecasts,
    otherDrugForecasts,
    drugForecastList,
    dashboardDrugSections: dashboardDrugSectionsComputed,
    totalTabletsAllForecastDrugs,
    finalCost,
    totalCostForYearForecast,
    costForYearForecast,
    tabletsForYearForecast,
    yearlyBreakdown,
  }
}

