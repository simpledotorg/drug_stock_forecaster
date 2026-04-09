<template>
  <div v-if="isActiveProtocolAssumptionsDirty" class="show-on-print full-width assumption-container">

    <h4 class="form-group-title">Adjusted protocol assumptions</h4>
    
    <div v-if="!activeProtocol" class="small-text">No protocol selected.</div>
    
    <div v-else-if="!changedSteps.length && !changedOtherDrugs.length" class="small-text">
      No adjustments from default assumptions.
    </div>
    
    <div v-else class="table-scroll">
      <table class="overrides-table">
        <thead>
          <tr>
            <th class="left">Item</th>
            <th class="right">Adjusted value</th>
            <th class="right">Default value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in changedSteps" :key="row.key">
            <td class="left">
              <span class="mono">Step {{ row.index + 1 }}</span>
              <span class="muted">—</span>
              <span>{{ row.label }}</span>
            </td>
            <td class="right mono">{{ row.current }}%</td>
            <td class="right mono">{{ row.defaultPct }}%</td>
          </tr>
          
          <tr v-for="row in changedOtherDrugs" :key="row.key">
            <td class="left">
              <span class="mono">Other</span>
            <span class="muted">—</span>
            <span>{{ row.label }}</span>
          </td>
          <td class="right mono">{{ row.current }}%</td>
          <td class="right mono">{{ row.defaultPct }}%</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDrugCalcStore } from '../../../../stores/drugsCalculator'
import { createInitialProtocols } from '../../../../stores/treatmentProtocols'

const store = useDrugCalcStore()
const { protocols, activeProtocolId } = storeToRefs(store)

const activeProtocol = computed(() => {
  const id = activeProtocolId.value
  return protocols.value?.find((p) => p.id === id) ?? null
})

const canonicalActiveProtocol = computed(() => {
  const defaults = createInitialProtocols()
  const id = activeProtocolId.value
  return defaults.find((p) => p.id === id) ?? null
})

function normPct(v) {
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

const changedSteps = computed(() => {
  const cur = activeProtocol.value?.steps ?? []
  const def = canonicalActiveProtocol.value?.steps ?? []
  const rows = []
  for (let i = 0; i < cur.length; i++) {
    const current = normPct(cur[i]?.percentage)
    const defaultPct = normPct(def[i]?.percentage)
    if (current === null || defaultPct === null) continue
    if (Number(current) === Number(defaultPct)) continue
    rows.push({
      key: `step-${i}`,
      index: i,
      label: cur[i]?.fullRegimen ?? cur[i]?.label ?? `Step ${i + 1}`,
      current,
      defaultPct,
    })
  }
  return rows
})

const changedOtherDrugs = computed(() => {
  const cur = activeProtocol.value?.otherDrugs ?? []
  const def = canonicalActiveProtocol.value?.otherDrugs ?? []
  const rows = []
  for (let i = 0; i < cur.length; i++) {
    const current = normPct(cur[i]?.percentage)
    const defaultPct = normPct(def[i]?.percentage)
    if (current === null || defaultPct === null) continue
    if (Number(current) === Number(defaultPct)) continue
    rows.push({
      key: `other-${i}`,
      index: i,
      label: cur[i]?.fullRegimen ?? cur[i]?.label ?? `Other drug ${i + 1}`,
      current,
      defaultPct,
    })
  }
  return rows
})

const isActiveProtocolAssumptionsDirty = computed(() => {
  return changedSteps.value.length > 0 || changedOtherDrugs.value.length > 0
})
</script>

<style scoped>
.assumption-container {
  margin-top: 2rem;
}

.small-text {
  font-size: 0.8rem;
  color: var(--muted);
}

.table-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.overrides-table {
  width: 100%;
  border-collapse: collapse;
}

.full-width {
  width: 100%;
}

th,
td {
  padding: 0.35rem 0.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.18);
  vertical-align: top;
}

th {
  font-weight: 700;
}

.left {
  text-align: left;
}

.right {
  text-align: right;
  white-space: nowrap;
}

.mono {
  font-family: var(--font-mono-table);
  font-variant-numeric: tabular-nums;
}

.muted {
  margin: 0 0.35rem;
  color: color-mix(in oklab, var(--muted) 65%, var(--ink));
}

@media print {
  h4 {
    color: #000;
    font-weight: 650;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }

  th,
  td {
    border-bottom-color: rgba(0, 0, 0, 0.28);
  }
}
</style>

