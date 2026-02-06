import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDrugCalcStore = defineStore('drugCalc', () => {

    // Population data
    const totalPopulation = ref(100000)
    const adultPopulation = ref(80)
    const prevalenceHTN = ref(25)
    const existingPatients = ref(20000)
    const targetEnrolment = ref(5000)
    const treatmentAdherence = ref(65)

    // Computed
    const estimatedHTNPopulation = computed(() => {
        return totalPopulation.value * adultPopulation.value / 100 * prevalenceHTN.value / 100
    })

    const htnCoverage = computed(() => {
        return existingPatients.value / estimatedHTNPopulation.value * 100
    })

    const targetNewEnrolmentInOneYear = computed(() => {
        return targetEnrolment.value / estimatedHTNPopulation.value * 100
    })

    const estimatedMonthlyEnrolment = computed(() => {
        return Math.round(targetEnrolment.value / 12)
    })

    const totalAdultPopulation = computed(() => {
        return totalPopulation.value * adultPopulation.value / 100
    })

    // 12 month figures
    const expectedCumulativeEnrolment = computed(() => {
        console.log('expectedCumulativeEnrolment', estimatedMonthlyEnrolment.value)
        console.log('existingPatients', existingPatients.value)
        if (!estimatedMonthlyEnrolment.value || !estimatedMonthlyEnrolment.value) return []
        const cumulativeEnrolment = []
        let cumulative = existingPatients.value
        for (let i = 0; i < 12; i++) {
            cumulative += estimatedMonthlyEnrolment.value
            cumulativeEnrolment.push(cumulative)
        }
        return cumulativeEnrolment
    })

    const patientsTreatedFromAdherence = computed(() => {
        const patientsTreated = []
        for (let i = 0; i < 12; i++) {
            patientsTreated.push(Math.round(expectedCumulativeEnrolment.value[i] * treatmentAdherence.value / 100))
        }
        return patientsTreated
    })

    const Step1Tablets = computed(() => { // amlodipine 5mg tablets
        const monthlyTablets = []
        for (let i = 0; i < 12; i++) {
            monthlyTablets.push(Math.round(patientsTreatedFromAdherence.value[i] * 30 * protocolPercentageStep1.value / 100))
        }
        return monthlyTablets
    })
    const Step1TabletsTotal = computed(() => { // total amlodipine 5mg tablets
        return Step1Tablets.value.reduce((acc, curr) => acc + curr, 0)
    })

    const Step2Tablets = computed(() => { // losartan 50mg tablets
        const monthlyTablets = []
        for (let i = 0; i < 12; i++) {
            monthlyTablets.push(Math.round(patientsTreatedFromAdherence.value[i] * 30 * protocolPercentageStep2.value / 100))
        }
        return monthlyTablets
    })
    
    const Step2TabletsTotal = computed(() => { // total losartan 50mg tablets
        return Step2Tablets.value.reduce((acc, curr) => acc + curr, 0)
    })

    const Step3Tablets = computed(() => { // amlodipine 5 + losartan 50mg tablets
        const monthlyTablets = []
        for (let i = 0; i < 12; i++) {
            monthlyTablets.push(Math.round(patientsTreatedFromAdherence.value[i] * 30 * protocolPercentageStep3.value / 100))
        }
        return monthlyTablets
    })
    const Step3TabletsTotal = computed(() => { // total amlodipine 5 + losartan 50mg tablets
        return Step3Tablets.value.reduce((acc, curr) => acc + curr, 0)
    })

    const Step4Tablets = computed(() => { // hydrochlorothiazide 25mg tablets
        const monthlyTablets = []
        for (let i = 0; i < 12; i++) {
            monthlyTablets.push(Math.round(patientsTreatedFromAdherence.value[i] * 30 * protocolPercentageStep4.value / 100))
        }
        return monthlyTablets
    })
    const Step4TabletsTotal = computed(() => { // total hydrochlorothiazide 25mg tablets
        return Step4Tablets.value.reduce((acc, curr) => acc + curr, 0)
    })

    const Step5Tablets = computed(() => { // unknown
        const monthlyTablets = []
        for (let i = 0; i < 12; i++) {
            monthlyTablets.push(Math.round(patientsTreatedFromAdherence.value[i] * 30 * protocolPercentageStep5.value / 100))
        }
        return monthlyTablets
    })
    const Step5TabletsTotal = computed(() => { // total unknown
        return Step5Tablets.value.reduce((acc, curr) => acc + curr, 0)
    })

    const Step6Tablets = computed(() => { // unknown
        const monthlyTablets = []
        for (let i = 0; i < 12; i++) {
            monthlyTablets.push(Math.round(patientsTreatedFromAdherence.value[i] * 30 * protocolPercentageStep6.value / 100))
        }
        return monthlyTablets
    })
    const Step6TabletsTotal = computed(() => { // total unknown
        return Step6Tablets.value.reduce((acc, curr) => acc + curr, 0)
    })

    const yearlyBreakdown = computed(() => {
        // convert all 12 month figures into a JSON object
        const yearlyBreakdown = {}
        for (let i = 0; i < 12; i++) {
            yearlyBreakdown[`month${i + 1}`] = {
                month: i + 1,
                expectedCumulativeEnrolment: expectedCumulativeEnrolment.value[i],
                patientsTreatedFromAdherence: patientsTreatedFromAdherence.value[i],
                amoldipine5mgTablets: Step1Tablets.value[i],
                amoldipine5mgTabletsTotal: Step1TabletsTotal.value,
                losartan50mgTablets: Step2Tablets.value[i],
                losartan50mgTabletsTotal: Step2TabletsTotal.value,
                amlodipine5losartan50mgTablets: Step3Tablets.value[i],
                amlodipine5losartan50mgTabletsTotal: Step3TabletsTotal.value,
                hydrochlorothiazide25mgTablets: Step4Tablets.value[i],
                hydrochlorothiazide25mgTabletsTotal: Step4TabletsTotal.value,
                unknown: Step5Tablets.value[i],
                unknownTotal: Step5TabletsTotal.value,
                unknown: Step6Tablets.value[i],
                unknownTotal: Step6TabletsTotal.value,
            }
        }
        return yearlyBreakdown
    })

    const tabletsForYearForecast = computed(() => {
        return {
            amlodipine5mgTabletsTotal: Step1TabletsTotal.value + Step3TabletsTotal.value,
            losartan50mgTabletsTotal: Step2TabletsTotal.value + Step3TabletsTotal.value,
            hydrochlorothiazide25mgTabletsTotal: Step3TabletsTotal.value,
        }
    })

    const costForYearForecast = computed(() => {
        return {
            amlodipine5mgCost: amoldipine5mgCost.value * tabletsForYearForecast.value.amlodipine5mgTabletsTotal,
            losartan50mgCost: losartan50mgCost.value * tabletsForYearForecast.value.losartan50mgTabletsTotal,
            hydrochlorothiazide25mgCost: hydrochlorothiazide25mgCost.value * tabletsForYearForecast.value.hydrochlorothiazide25mgTabletsTotal,
        }
    })


    //  Drug data
    const amoldipine5mgCost = ref()
    const losartan50mgCost = ref()
    const hydrochlorothiazide25mgCost = ref()

    const protocolPercentageStep1 = ref(100)
    const protocolPercentageStep2 = ref(40)
    const protocolPercentageStep3 = ref(25)
    const protocolPercentageStep4 = ref(5)
    const protocolPercentageStep5 = ref(0)
    const protocolPercentageStep6 = ref(0)

    return {
        // State
        totalPopulation,
        adultPopulation,
        prevalenceHTN,
        existingPatients,
        targetEnrolment,
        treatmentAdherence,
        // Computed
        estimatedHTNPopulation,
        htnCoverage,
        targetNewEnrolmentInOneYear,
        totalAdultPopulation,
        estimatedMonthlyEnrolment,
        expectedCumulativeEnrolment,
        patientsTreatedFromAdherence,
        Step1Tablets,
        Step2Tablets,
        Step3Tablets,
        Step4Tablets,
        Step5Tablets,
        Step6Tablets,
        yearlyBreakdown,
        Step1TabletsTotal,
        Step2TabletsTotal,
        Step3TabletsTotal,
        Step4TabletsTotal,
        Step5TabletsTotal,
        Step6TabletsTotal,
        tabletsForYearForecast,
        costForYearForecast,
        // Drug data
        amoldipine5mgCost,
        losartan50mgCost,
        hydrochlorothiazide25mgCost,
    }
})

