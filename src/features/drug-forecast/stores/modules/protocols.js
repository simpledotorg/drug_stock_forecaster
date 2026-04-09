import { ref, computed, triggerRef } from 'vue'
import { createInitialDrugCatalog, createInitialProtocols } from '../../../../stores/treatmentProtocols'
import { otherDrugsForProtocol, uniqueDrugIdsFromProtocol } from '../../utils/forecastMath'

export function createProtocolsModule() {
  const drugCatalog = ref(createInitialDrugCatalog())
  const protocols = ref(structuredClone(createInitialProtocols()))
  const activeProtocolId = ref(protocols.value[0]?.id ?? '')

  const activeProtocol = computed(() => protocols.value.find((p) => p.id === activeProtocolId.value))
  const activeOtherDrugs = computed(() => otherDrugsForProtocol(activeProtocol.value))

  /** Restore step and other-drug control % from canonical protocol definitions (`createInitialProtocols`). */
  function resetActiveProtocolAssumptions() {
    const id = activeProtocolId.value
    const defaults = createInitialProtocols()
    const initial = defaults.find((p) => p.id === id)
    const current = protocols.value.find((p) => p.id === id)
    if (!initial || !current) return
    const a = current.steps ?? []
    const b = initial.steps ?? []
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      if (a[i] && b[i]) a[i].percentage = b[i].percentage
    }
    const oc = current.otherDrugs
    const ob = initial.otherDrugs
    if (oc?.length && ob?.length) {
      for (let i = 0; i < Math.min(oc.length, ob.length); i++) {
        if (oc[i] && ob[i]) oc[i].percentage = ob[i].percentage
      }
    }
    triggerRef(protocols)
  }

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
    resetActiveProtocolAssumptions,
  }
}

