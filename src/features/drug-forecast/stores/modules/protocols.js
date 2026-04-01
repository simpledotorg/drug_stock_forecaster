import { ref, computed } from 'vue'
import { createInitialDrugCatalog, createInitialProtocols } from '../../../../stores/treatmentProtocols'
import { otherDrugsForProtocol, uniqueDrugIdsFromProtocol } from '../../utils/forecastMath'

export function createProtocolsModule() {
  const drugCatalog = ref(createInitialDrugCatalog())
  const protocols = ref(createInitialProtocols())
  const activeProtocolId = ref(protocols.value[0]?.id ?? '')

  const activeProtocol = computed(() => protocols.value.find((p) => p.id === activeProtocolId.value))
  const activeOtherDrugs = computed(() => otherDrugsForProtocol(activeProtocol.value))

  const catalogDrugsForActiveProtocol = computed(() => {
    const ids = uniqueDrugIdsFromProtocol(activeProtocol.value)
    return ids
      .map((id) => drugCatalog.value.find((d) => d.id === id))
      .filter(Boolean)
      .sort((a, b) => a.name.localeCompare(b.name))
  })

  return {
    drugCatalog,
    protocols,
    activeProtocolId,
    activeProtocol,
    activeOtherDrugs,
    catalogDrugsForActiveProtocol,
  }
}

