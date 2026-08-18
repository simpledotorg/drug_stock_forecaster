import { ref, computed, triggerRef } from 'vue'
import {
  applyProtocolDefaultCosts,
  createInitialDrugCatalog,
  createInitialProtocols,
  resolveOptionalStatinLine,
} from '../../../../stores/treatmentProtocols'
import { otherDrugsForProtocol, uniqueDrugIdsFromProtocol } from '../../utils/forecastMath'

const STATIN_DRUG_IDS = new Set(['atorvastatin-10mg', 'atorvastatin-20mg', 'simvastatin-20mg'])

function protocolIncludesStatin(protocol) {
  return uniqueDrugIdsFromProtocol(protocol).some((id) => STATIN_DRUG_IDS.has(id))
}

export function createProtocolsModule() {
  const drugCatalog = ref(createInitialDrugCatalog())
  const protocols = ref(structuredClone(createInitialProtocols()))
  const activeProtocolId = ref(protocols.value[0]?.id ?? '')
  const includeStatins = ref(true)
  const optionalStatinPercentage = ref(30)

  const activeProtocol = computed(() => protocols.value.find((p) => p.id === activeProtocolId.value))
  const optionalStatinLine = computed(() => resolveOptionalStatinLine(activeProtocol.value))
  const protocolHasStatin = computed(() => protocolIncludesStatin(activeProtocol.value))
  const effectiveOtherDrugs = computed(() => {
    const base = otherDrugsForProtocol(activeProtocol.value)
    if (protocolHasStatin.value || !includeStatins.value) return base
    return [
      ...base,
      {
        label: optionalStatinLine.value.label,
        drugIds: optionalStatinLine.value.drugIds,
        percentage: optionalStatinPercentage.value,
      },
    ]
  })
  const activeOtherDrugs = effectiveOtherDrugs

  function setActiveProtocolId(id) {
    if (activeProtocolId.value === id) return
    activeProtocolId.value = id
    applyProtocolDefaultCosts(activeProtocol.value, drugCatalog.value)
  }

  applyProtocolDefaultCosts(activeProtocol.value, drugCatalog.value)

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
    optionalStatinPercentage.value = resolveOptionalStatinLine(initial).percentage
    triggerRef(protocols)
  }

  const catalogDrugsForActiveProtocol = computed(() => {
    const ids = uniqueDrugIdsFromProtocol(activeProtocol.value)
    const protocolDrugs = ids
      .map((id) => drugCatalog.value.find((d) => d.id === id))
      .filter(Boolean)

    if (protocolHasStatin.value || !includeStatins.value) return protocolDrugs
    const statinId = optionalStatinLine.value.drugIds[0]
    const statin = drugCatalog.value.find((d) => d.id === statinId)
    if (!statin || protocolDrugs.some((d) => d.id === statin.id)) return protocolDrugs
    return [...protocolDrugs, statin]
  })

  return {
    drugCatalog,
    protocols,
    activeProtocolId,
    setActiveProtocolId,
    activeProtocol,
    includeStatins,
    optionalStatinPercentage,
    optionalStatinLine,
    protocolHasStatin,
    effectiveOtherDrugs,
    activeOtherDrugs,
    catalogDrugsForActiveProtocol,
    resetActiveProtocolAssumptions,
  }
}
