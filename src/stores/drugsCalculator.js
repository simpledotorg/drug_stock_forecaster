import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { createInitialDrugCatalog, createInitialProtocols } from './treatmentProtocols'
import {
    otherDrugsForProtocol,
    forecastLinesForPatients,
    aggregateDrugsFromForecastLines,
    dashboardDrugSections,
    buildYearlyBreakdown,
    drugCostWritable,
    uniqueDrugIdsFromProtocol,
} from './drugCalcHelpers'

export const useDrugCalcStore = defineStore('drugCalc', () => {
    // --- State: inputs & UI ---
    const totalPopulation = ref()
    const adultPopulation = ref()
    const prevalenceHTN = ref()
    const patientsUnderCare = ref(200000)
    const targetEnrolment = ref(8000)
    const treatmentAdherence = ref(65)
    const forecastMonths = ref(12)
    const currencySymbol = ref('₱')
    const currencySymbolPosition = ref('start')
    const showCalculation = ref(false)

    const drugCatalog = ref(createInitialDrugCatalog())
    const protocols = ref(createInitialProtocols())
    const activeProtocolId = ref(protocols.value[0]?.id ?? '')

    // --- Active protocol ---
    const activeProtocol = computed(() =>
        protocols.value.find((p) => p.id === activeProtocolId.value),
    )

    const activeOtherDrugs = computed(() => otherDrugsForProtocol(activeProtocol.value))

    const catalogDrugsForActiveProtocol = computed(() => {
        const ids = uniqueDrugIdsFromProtocol(activeProtocol.value)
        return ids
            .map((id) => drugCatalog.value.find((d) => d.id === id))
            .filter(Boolean)
            .sort((a, b) => a.name.localeCompare(b.name))
    })

    // --- Population / enrolment pipeline ---
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
                    Math.ceil((patientsUnderCare.value * treatmentAdherence.value) / 100 + estimatedMonthlyEnrolment.value),
                )
            } else {
                out.push(
                    Math.ceil((expectedCumulativeEnrolment.value[i - 1] * treatmentAdherence.value) / 100 + estimatedMonthlyEnrolment.value),
                )
            }
        }
        return out
    })

    // --- Tablet demand: stacked steps + optional other meds ---
    const stepForecasts = computed(() => {
        const protocol = activeProtocol.value
        if (!protocol?.steps?.length) return []
        return forecastLinesForPatients(
            protocol.steps,
            forecastMonths.value,
            patientsTreatedFromAdherence.value,
        )
    })

    const otherDrugForecasts = computed(() => {
        const lines = otherDrugsForProtocol(activeProtocol.value)
        if (!lines.length) return []
        return forecastLinesForPatients(
            lines,
            forecastMonths.value,
            patientsTreatedFromAdherence.value,
        )
    })

    const drugForecastList = computed(() =>
        aggregateDrugsFromForecastLines(
            stepForecasts.value,
            otherDrugForecasts.value,
            drugCatalog.value,
            forecastMonths.value,
        ),
    )

    const dashboardDrugSectionsComputed = computed(() =>
        dashboardDrugSections(drugForecastList.value, activeProtocol.value),
    )

    const totalTabletsAllForecastDrugs = computed(() =>
        drugForecastList.value.reduce((s, d) => s + d.totalTablets, 0),
    )

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

    // --- Legacy URL/query cost fields (bind to catalog) ---
    const amoldipine5mgCost = drugCostWritable(drugCatalog, 'amlodipine-5mg')
    const losartan50mgCost = drugCostWritable(drugCatalog, 'losartan-50mg')
    const hydrochlorothiazide25mgCost = drugCostWritable(drugCatalog, 'hctz-25mg')
    const telmisartan40mgCost = drugCostWritable(drugCatalog, 'telmisartan-40mg')

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
        showCalculation,
        drugCatalog,
        protocols,
        activeProtocolId,
        activeProtocol,
        activeOtherDrugs,
        catalogDrugsForActiveProtocol,
        estimatedHTNPopulation,
        htnCoverage,
        totalAdultPopulation,
        estimatedMonthlyEnrolment,
        expectedCumulativeEnrolment,
        patientsTreatedFromAdherence,
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
        amoldipine5mgCost,
        losartan50mgCost,
        hydrochlorothiazide25mgCost,
        telmisartan40mgCost,
        inputsComplete,
    }
})
