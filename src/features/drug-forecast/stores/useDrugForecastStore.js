import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createInputsModule } from './modules/inputs'
import { createProtocolsModule } from './modules/protocols'
import { createForecastPipelineModule } from './modules/forecastPipeline'
import { createCostsModule } from './modules/costs'

export const useDrugForecastStore = defineStore('drugCalc', () => {
  const showCalculation = ref(false)

  const inputs = createInputsModule()
  const protocols = createProtocolsModule()
  const pipeline = createForecastPipelineModule({
    forecastMonths: inputs.forecastMonths,
    patientsTreatedFromAdherence: inputs.patientsTreatedFromAdherence,
    expectedCumulativeEnrolment: inputs.expectedCumulativeEnrolment,
    activeProtocol: protocols.activeProtocol,
    drugCatalog: protocols.drugCatalog,
  })
  const costs = createCostsModule({ drugCatalog: protocols.drugCatalog })

  return {
    showCalculation,
    ...inputs,
    ...protocols,
    ...pipeline,
    ...costs,
  }
})

