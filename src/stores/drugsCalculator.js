import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Add drugs here. Each protocol step references drug ids from this catalog.
 * Helps to ensure tablet counts are calculated correctly.
 */
function createInitialDrugCatalog() {
    return [
        { id: 'amlodipine-5mg', name: 'Amlodipine 5mg', costPerTablet: undefined },
        { id: 'losartan-50mg', name: 'Losartan 50mg', costPerTablet: undefined },
        { id: 'hctz-25mg', name: 'Hydrochlorothiazide 25mg', costPerTablet: undefined },
        { id: 'telmisartan-40mg', name: 'Telmisartan 40mg', costPerTablet: undefined },
        { id: 'atorvastatin-20mg', name: 'Atorvastatin 20mg', costPerTablet: undefined },
    ]
}

/**
 * Add protocols here.
 * - steps: stacked treatment lines (same shape: label, drugIds, percentage).
 * - otherDrugs: optional; omit if none. Same line shape as steps when present.
 */
function otherDrugsForProtocol(protocol) {
    return protocol?.otherDrugs ?? []
}

function createInitialProtocols() {
    return [
        {
            id: 'philippines-htn',
            name: 'Philippines (HTN)',
            steps: [
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 100 },
                { label: 'Losartan 50mg', drugIds: ['losartan-50mg'], percentage: 40 },
                {
                    label: 'Amlodipine 5mg + Losartan 50mg',
                    drugIds: ['amlodipine-5mg', 'losartan-50mg'],
                    percentage: 25,
                },
                { label: 'Hydrochlorothiazide 25mg', drugIds: ['hctz-25mg'], percentage: 5 },
            ],
        },
        {
            id: 'aalh',
            name: 'AALH',
            steps: [
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 100 },
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 40 },
                {
                    label: 'Losartan 50mg',
                    drugIds: ['losartan-50mg'],
                    percentage: 25,
                },
                { label: 'Hydrochlorothiazide 25mg', drugIds: ['hctz-25mg'], percentage: 5 },
            ],
        },
        {
            id: 'aath',
            name: 'AATH with Statin',
            steps: [
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 100 },
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 40 },
                {
                    label: 'Losartan 50mg',
                    drugIds: ['losartan-50mg'],
                    percentage: 25,
                },
                { label: 'Hydrochlorothiazide 25mg', drugIds: ['hctz-25mg'], percentage: 5 },
            ],
            otherDrugs: [
                { label: 'Atorvastatin 20mg', drugIds: ['atorvastatin-20mg'], percentage: 30 },
            ],
        },
        {
            id: 'alh',
            name: 'ALH',
            steps: [
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 100 },
                {
                    label: 'Losartan 50mg',
                    drugIds: ['losartan-50mg'],
                    percentage: 40,
                },
                { label: 'Hydrochlorothiazide 25mg', drugIds: ['hctz-25mg'], percentage: 25 },
            ],
        },
        {
            id: 'attah',
            name: 'ATTAH',
            steps: [
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 100 },
                { label: 'Telmisartan 40mg', drugIds: ['telmisartan-40mg'], percentage: 40 },
                { label: 'Telmisartan 40mg', drugIds: ['telmisartan-40mg'], percentage: 25 },
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 12 },
                { label: 'Hydrochlorothiazide 25mg', drugIds: ['hctz-25mg'], percentage: 5 },
            ],
        },
        {
            id: 'alalh',
            name: 'AL(AL)H',
            steps: [
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 100 },
                { label: 'Losartan 50mg', drugIds: ['losartan-50mg'], percentage: 40 },
                { label: 'Amlodipine 5mg + Losartan 50mg', drugIds: ['amlodipine-5mg', 'losartan-50mg'], percentage: 25 },
                { label: 'Hydrochlorothiazide 25mg', drugIds: ['hctz-25mg'], percentage: 5 },
            ],
        },
        {
            id: 'aallh',
            name: 'AALLH',
            steps: [
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 100 },
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 50 },
                { label: 'Losartan 50mg', drugIds: ['losartan-50mg'], percentage: 30 },
                { label: 'Losartan 50mg', drugIds: ['losartan-50mg'], percentage: 15 },
                { label: 'Hydrochlorothiazide 25mg', drugIds: ['hctz-25mg'], percentage: 5 },
            ],
        },
        
    ]
}

/** Collect unique drug ids from protocol step / other-drug lines. */
function collectDrugIdsFromLines(lines) {
    const ids = new Set()
    if (!lines) return ids
    for (const line of lines) {
        for (const id of line.drugIds) ids.add(id)
    }
    return ids
}

function forecastLinesForPatients(lines, months, patientsTreated) {
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

function drugCostWritable(catalogRef, drugId) {
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

export const useDrugCalcStore = defineStore('drugCalc', () => {
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

    const activeProtocol = computed(() =>
        protocols.value.find((p) => p.id === activeProtocolId.value),
    )

    const activeOtherDrugs = computed(() => otherDrugsForProtocol(activeProtocol.value))

    /** Catalog rows for drugs used in stacked steps or otherDrugs (for cost inputs). */
    const catalogDrugsForActiveProtocol = computed(() => {
        const protocol = activeProtocol.value
        if (!protocol) return []
        const seen = new Set()
        const ids = []
        const addFromLines = (lines) => {
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
        addFromLines(protocol.steps)
        addFromLines(otherDrugsForProtocol(protocol))
        return ids
            .map((id) => drugCatalog.value.find((d) => d.id === id))
            .filter(Boolean)
            .sort((a, b) => a.name.localeCompare(b.name))
    })

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
        const cumulativeEnrolment = []
        let cumulative = patientsUnderCare.value
        for (let i = 0; i < forecastMonths.value; i++) {
            cumulative += estimatedMonthlyEnrolment.value
            cumulativeEnrolment.push(cumulative)
        }
        return cumulativeEnrolment
    })

    const patientsTreatedFromAdherence = computed(() => {
        const patientsTreated = []
        for (let i = 0; i < forecastMonths.value; i++) {
            patientsTreated.push(
                Math.ceil((expectedCumulativeEnrolment.value[i] * treatmentAdherence.value) / 100),
            )
        }
        return patientsTreated
    })

    const stepForecasts = computed(() => {
        const protocol = activeProtocol.value
        if (!protocol?.steps?.length) return []
        return forecastLinesForPatients(
            protocol.steps,
            forecastMonths.value,
            patientsTreatedFromAdherence.value,
        )
    })

    /** Parallel meds (not part of stacked HTN steps); same tablet math, own %. */
    const otherDrugForecasts = computed(() => {
        const protocol = activeProtocol.value
        const lines = otherDrugsForProtocol(protocol)
        if (!lines.length) return []
        return forecastLinesForPatients(
            lines,
            forecastMonths.value,
            patientsTreatedFromAdherence.value,
        )
    })

    const drugForecastList = computed(() => {
        const months = forecastMonths.value
        const byId = new Map()
        const addFromForecastLines = (lines) => {
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
        addFromForecastLines(stepForecasts.value)
        addFromForecastLines(otherDrugForecasts.value)
        const list = []
        for (const [drugId, { monthly }] of byId) {
            const drug = drugCatalog.value.find((d) => d.id === drugId)
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
    })

    /** Dashboard: protocol-step drugs vs other-only (same drug can appear in both; listed under protocol with combined total). */
    const dashboardDrugSections = computed(() => {
        const p = activeProtocol.value
        const inSteps = collectDrugIdsFromLines(p?.steps)
        const inOther = collectDrugIdsFromLines(otherDrugsForProtocol(p))
        const list = drugForecastList.value
        const byName = (a, b) => a.name.localeCompare(b.name)
        return {
            protocolDrugs: list.filter((d) => inSteps.has(d.id)).sort(byName),
            otherOnlyDrugs: list.filter((d) => inOther.has(d.id) && !inSteps.has(d.id)).sort(byName),
        }
    })

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
        for (const d of drugForecastList.value) {
            o[d.id] = d.lineCost
        }
        return o
    })

    const tabletsForYearForecast = computed(() => {
        const o = {}
        for (const d of drugForecastList.value) {
            o[d.id] = d.totalTablets
        }
        return o
    })

    const yearlyBreakdown = computed(() => {
        const steps = stepForecasts.value
        const other = otherDrugForecasts.value
        const n = forecastMonths.value
        const rows = []
        for (let i = 0; i < n; i++) {
            rows.push({
                month: i + 1,
                expectedCumulativeEnrolment: expectedCumulativeEnrolment.value[i],
                patientsTreatedFromAdherence: patientsTreatedFromAdherence.value[i],
                stepTablets: steps.map((s) => s.monthly[i]),
                otherDrugTablets: other.map((s) => s.monthly[i]),
            })
        }
        return rows
    })

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
        dashboardDrugSections,
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
