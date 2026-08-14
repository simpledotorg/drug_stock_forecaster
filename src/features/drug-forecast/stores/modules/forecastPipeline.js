import { computed, onScopeDispose, ref, watch } from 'vue'
import { forecastLinesForPatients, aggregateDrugsFromForecastLines, dashboardDrugSections, buildYearlyBreakdown } from '../../utils/forecastMath'

const FORECAST_DISPLAY_DELAY_MS = 1250

function emptySnapshot() {
  return {
    stepForecasts: [],
    otherDrugForecasts: [],
    drugForecastList: [],
    dashboardDrugSections: { protocolDrugs: [], otherOnlyDrugs: [] },
    totalTabletsAllForecastDrugs: 0,
    finalCost: null,
    costForYearForecast: {},
    tabletsForYearForecast: {},
    yearlyBreakdown: [],
  }
}

function captureFromLive({
  forecastMonths,
  patientsTreatedFromAdherence,
  activeProtocol,
  drugCatalog,
  expectedCumulativeEnrolment,
}) {
  const protocol = activeProtocol.value
  const months = forecastMonths.value
  const treated = patientsTreatedFromAdherence.value
  const stepForecasts = protocol?.steps?.length
    ? forecastLinesForPatients(protocol.steps, months, treated)
    : []
  const otherLines = protocol?.otherDrugs ?? []
  const otherDrugForecasts = otherLines.length
    ? forecastLinesForPatients(otherLines, months, treated)
    : []
  const drugForecastList = aggregateDrugsFromForecastLines(
    stepForecasts,
    otherDrugForecasts,
    drugCatalog.value,
    months,
  )
  const sections = dashboardDrugSections(drugForecastList, protocol)
  const totalTabletsAllForecastDrugs = drugForecastList.reduce((s, d) => s + d.totalTablets, 0)
  const finalCost =
    drugForecastList.length && !drugForecastList.some((d) => d.lineCost === null)
      ? drugForecastList.reduce((s, d) => s + d.lineCost, 0)
      : null
  const costForYearForecast = {}
  const tabletsForYearForecast = {}
  for (const d of drugForecastList) {
    costForYearForecast[d.id] = d.lineCost
    tabletsForYearForecast[d.id] = d.totalTablets
  }
  const yearlyBreakdown = buildYearlyBreakdown(
    months,
    expectedCumulativeEnrolment.value,
    treated,
    stepForecasts,
    otherDrugForecasts,
  )
  return {
    stepForecasts,
    otherDrugForecasts,
    drugForecastList,
    dashboardDrugSections: sections,
    totalTabletsAllForecastDrugs,
    finalCost,
    costForYearForecast,
    tabletsForYearForecast,
    yearlyBreakdown,
  }
}

export function createForecastPipelineModule({
  forecastMonths,
  patientsTreatedFromAdherence,
  activeProtocol,
  drugCatalog,
  expectedCumulativeEnrolment,
}) {
  const snapshot = ref(emptySnapshot())
  const isRecalculating = ref(false)
  let first = true
  let timer = null

  function capture() {
    isRecalculating.value = false
    snapshot.value = captureFromLive({
      forecastMonths,
      patientsTreatedFromAdherence,
      activeProtocol,
      drugCatalog,
      expectedCumulativeEnrolment,
    })
  }

  watch(
    () => ({
      protocolId: activeProtocol.value?.id,
      forecastMonths: forecastMonths.value,
      treated: patientsTreatedFromAdherence.value,
      enrolment: expectedCumulativeEnrolment.value,
      protocol: activeProtocol.value,
      costs: Array.isArray(drugCatalog.value)
        ? drugCatalog.value.map((d) => d.costPerTablet)
        : [],
    }),
    (next, prev) => {
      if (first) {
        first = false
        capture()
        return
      }
      clearTimeout(timer)
      timer = null
      if (next.protocolId !== prev?.protocolId) {
        capture()
        return
      }
      isRecalculating.value = true
      timer = setTimeout(() => {
        timer = null
        capture()
      }, FORECAST_DISPLAY_DELAY_MS)
    },
    { deep: true, immediate: true },
  )

  onScopeDispose(() => {
    clearTimeout(timer)
    timer = null
    isRecalculating.value = false
  })

  return {
    isRecalculating,
    stepForecasts: computed(() => snapshot.value.stepForecasts),
    otherDrugForecasts: computed(() => snapshot.value.otherDrugForecasts),
    drugForecastList: computed(() => snapshot.value.drugForecastList),
    dashboardDrugSections: computed(() => snapshot.value.dashboardDrugSections),
    totalTabletsAllForecastDrugs: computed(() => snapshot.value.totalTabletsAllForecastDrugs),
    finalCost: computed(() => snapshot.value.finalCost),
    totalCostForYearForecast: computed(() => snapshot.value.finalCost),
    costForYearForecast: computed(() => snapshot.value.costForYearForecast),
    tabletsForYearForecast: computed(() => snapshot.value.tabletsForYearForecast),
    yearlyBreakdown: computed(() => snapshot.value.yearlyBreakdown),
  }
}
