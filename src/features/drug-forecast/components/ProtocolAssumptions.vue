<template>
  <CollapsibleSection v-if="activeProtocol" title="Treatment protocol & control assumptions" :meta="activeProtocol.name"
    :default-open="false" show-print-include v-model:include-in-print="includeInPrint">
    <template #meta>
      <span v-if="isActiveProtocolAssumptionsDirty" class="meta-warning">
        Adjusted from defaults</span>
    </template>
    <div class="content-padding">

      <h3>Treatment protocol & control assumptions</h3>
      <p class="small-text">Important: The tool is customized based on real-world experience with treatment protocols.
        Control rates at each step reflect experience from 1M+ patients and can be updated with local data. Any future
        protocol changes will require formula adjustments — ideally updated and redistributed at the national/provincial
        level.</p>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th class="left-align">Step</th>
              <th class="left-align">Treatment</th>
              <th class="number-header">Control assumption</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(step, idx) in activeProtocol.steps" :key="activeProtocol.id + '-' + idx">
              <td class="step-cell left-align">{{ idx + 1 }}</td>
              <td class="regimen-cell left-align">{{ step.fullRegimen ?? step.label }}</td>
              <td>
                <div class="assumption-cell">
                  <span
                    v-if="defaultPercentageForStep(idx) !== null && Number(step.percentage) !== Number(defaultPercentageForStep(idx))"
                    class="assumption-default-label hide-on-print">
                    Default {{ defaultPercentageForStep(idx) }}%
                  </span>
                  <input v-model.number="step.percentage" class="input input--pct hide-on-print" type="number" min="0"
                    max="100" step="1" inputmode="numeric" required />
                  <span class="show-on-print">{{ step.percentage }}</span>
                  <span class="margin-left">%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="activeProtocol.otherDrugs?.length" class="table-scroll">
        <table>
          <thead>
            <tr>
              <th class="left-align">Other drugs</th>
              <th class="number-header">Patients on treatment</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(drug, idx) in activeProtocol.otherDrugs" :key="activeProtocol.id + '-other-' + idx">
              <td class="regimen-cell left-align">{{ drug.fullRegimen ?? drug.label }}</td>
              <td>
                <div class="assumption-cell">
                  <span
                    v-if="defaultPercentageForOtherDrug(idx) !== null && Number(drug.percentage) !== Number(defaultPercentageForOtherDrug(idx))"
                    class="assumption-default-label hide-on-print">
                    Default {{ defaultPercentageForOtherDrug(idx) }}%
                  </span>
                  <input v-model.number="drug.percentage" class="input input--pct hide-on-print" type="number" min="0"
                    max="100" step="1" inputmode="numeric" required />
                  <span class="show-on-print">{{ drug.percentage }}</span>
                  <span class="margin-left">%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="actions-row">
        <button v-if="isActiveProtocolAssumptionsDirty" class="reset-btn" type="button"
          @click="() => store.resetActiveProtocolAssumptions()">
          Reset assumptions
        </button>
      </div>
      <slot name="actions">

      </slot>
    </div>
  </CollapsibleSection>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import CollapsibleSection from '../../../components/CollapsibleSection.vue'
import { useDrugCalcStore } from '../../../stores/drugsCalculator'
import { createInitialProtocols } from '../../../stores/treatmentProtocols'

/** Synced with parent `App.vue` for `@media print` visibility via `.print-hide`. */
const includeInPrint = defineModel('includeInPrint', { type: Boolean, default: false })

const store = useDrugCalcStore()
const { protocols, activeProtocolId } = storeToRefs(store)

const activeProtocol = computed(() => {
  const id = activeProtocolId.value
  return protocols.value?.find((p) => p.id === id) ?? null
})

const canonicalProtocols = computed(() => createInitialProtocols())

const canonicalActiveProtocol = computed(() => {
  const id = activeProtocolId.value
  return canonicalProtocols.value?.find((p) => p.id === id) ?? null
})

function defaultPercentageForStep(idx) {
  const pct = canonicalActiveProtocol.value?.steps?.[idx]?.percentage
  if (pct === undefined || pct === null || Number.isNaN(Number(pct))) return null
  return Number(pct)
}

function defaultPercentageForOtherDrug(idx) {
  const pct = canonicalActiveProtocol.value?.otherDrugs?.[idx]?.percentage
  if (pct === undefined || pct === null || Number.isNaN(Number(pct))) return null
  return Number(pct)
}

/** Compare live `protocols` to fresh defaults from `createInitialProtocols()` (same source as reset). */
const isActiveProtocolAssumptionsDirty = computed(() => {
  const id = activeProtocolId.value
  const current = protocols.value?.find((p) => p.id === id)
  const initial = canonicalProtocols.value.find((p) => p.id === id)
  if (!current?.steps?.length || !initial?.steps?.length) return false
  const a = current.steps
  const b = initial.steps
  if (a.length !== b.length) return true
  for (let i = 0; i < a.length; i++) {
    if (Number(a[i]?.percentage) !== Number(b[i]?.percentage)) return true
  }
  const co = current.otherDrugs ?? []
  const io = initial.otherDrugs ?? []
  if (co.length !== io.length) return co.length > 0 || io.length > 0
  for (let i = 0; i < co.length; i++) {
    if (Number(co[i]?.percentage) !== Number(io[i]?.percentage)) return true
  }
  return false
})
</script>

<style scoped>
h3 {
  margin-top: 0;
  margin-bottom: 0;
}

.meta-warning {
  font-size: 12px;
  font-weight: 400;
  color: #a16207;
  margin-left: 0.25rem;
}

.assumption-cell {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.assumption-default-label {
  font-size: 0.75rem;
  color: color-mix(in oklab, var(--muted, #64748b) 70%, var(--ink, #0f172a));
  white-space: nowrap;
}

@media print {

  h3 {
    margin-top: 3rem;
    margin-bottom: 0;
  }

  .table-scroll {
    overflow: visible;
  }

  .table-scroll table {
    min-width: 0;
  }

  th,
  td {
    border: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.35);
  }

  .total-row {
    background: #fff;
  }

  .total-row th,
  .total-row td,
  .total-row .number-cell,
  .total-row span {
    font-weight: 700;
  }

  .step-header-row th,
  .step-header-row td {
    border-bottom: none;
  }

  .actions-row {
    display: none;
  }
}

.table-scroll {
  width: 100%;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
}

.table-scroll table {
  min-width: 760px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;
}

th,
td {
  border: none;
  border-bottom: 1px solid #ddd;
  padding: 0.5rem 0.75rem;
  vertical-align: middle;
}

thead th {
  font-weight: 600;
  text-align: right;
}

thead th.row-label {
  text-align: left;
}

tbody th.row-label {
  text-align: left;
  font-weight: 400;
}

td {
  text-align: right;
}

.number-header {
  text-align: right;
}

.step-cell {
  width: 6rem;
  font-family: var(--font-mono-table);
  color: var(--warm-gray-700, #666);
}

.regimen-cell {
  min-width: 220px;
}

.number-cell {
  font-family: var(--font-mono-table);
  font-size: 0.95rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.total-row th,
.total-row td,
.total-row .number-cell,
.total-row span {
  font-weight: 700;
}

/* Same visual system as sidebar form fields (`.input` in DrugForecastForm.vue); width tuned for the table. */
.input--pct {
  width: 100%;
  max-width: 5.5rem;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.actions-row {
  display: flex;
  justify-content: flex-end;
  padding: 0.75rem 0 0;
  min-height: 56px;
}

.reset-btn {
  /* border: 1px solid color-mix(in oklab, var(--faint) 70%, #0000);
   */
  border: none;
  background: #ededed;
  padding: 0.4rem 1rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.reset-btn:hover {
  background: color-mix(in oklab, var(--paper) 88%, var(--accent) 12%);
}

.other-col {
  background: #faf8fc;
}

/* No border between “Step n” row and column titles — single header band */
.step-header-row th,
.step-header-row td {
  border-bottom: none;
}

.step-header-row .blank-header {
  background: transparent;
}

.step-header-row .step-col {
  text-align: right;
  vertical-align: bottom;
  padding-top: 4rem;
  padding-bottom: 0.35rem;
}

.step-tooltip-wrap {
  position: relative;
  display: inline-block;
  max-width: 100%;
  cursor: help;
  outline: none;
}

.step-tooltip-wrap:focus-visible {
  border-radius: 2px;
  box-shadow: 0 0 0 2px var(--focus-ring);
}

.step-tooltip-text {
  display: inline-block;
  font-size: 0.75rem;
  /* text-transform: uppercase; */
  letter-spacing: 0.06em;
  color: var(--warm-gray-700, #666);
  text-decoration: underline;
  text-decoration-style: dashed;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  text-decoration-color: var(--warm-gray-600, #888);
}

.step-tooltip-bubble {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 0.35rem);
  top: auto;
  transform: translateX(-50%);
  padding: 0.5rem 0.75rem;
  max-width: min(320px, 85vw);
  width: max-content;
  font-size: 0.8rem;
  font-weight: 400;
  line-height: 1.35;
  text-align: left;
  text-transform: none;
  letter-spacing: normal;
  color: #f0f0f0;
  background: #2d2d2d;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  white-space: normal;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;
  z-index: 30;
  pointer-events: none;
}

.step-tooltip-bubble__title {
  display: block;
  font-weight: 600;
  margin-bottom: 0.15rem;
}

.step-tooltip-bubble__regimen {
  display: block;
  font-weight: 400;
}

.step-tooltip-bubble::before {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -6px;
  border: 6px solid transparent;
  border-top-color: #2d2d2d;
}

/* Last step: anchor bubble to the right so it isn’t clipped by horizontal scroll */
.step-tooltip-wrap--bubble-end .step-tooltip-bubble {
  left: auto;
  right: 0;
  transform: none;
}

.step-tooltip-wrap--bubble-end .step-tooltip-bubble::before {
  left: auto;
  right: 0.65rem;
  margin-left: 0;
}

.step-tooltip-wrap:hover .step-tooltip-bubble,
.step-tooltip-wrap:focus .step-tooltip-bubble {
  opacity: 1;
  visibility: visible;
}

.step-header-filler {
  padding: 0.35rem 0.75rem;
  background: transparent;
}

.total-row {
  background-color: #fff9d7;
}

.breakdown-toggle-wrap {
  margin: 2rem 0 -1.2rem;
}

.left-align {
  text-align: left;
}

.input--pct {
  width: 64px;
  text-align: right;
  height: 32px;
  padding: 0.4rem 0.3rem 0.4rem 0.7rem;

  margin: -3px 0;
  border-width: 1px;
}

.margin-left {
  margin-left: 0.4rem;
}

.input--pct {
  width: 64px;
  text-align: right;
  height: 32px;
  padding: 0.4rem 0.3rem 0.4rem 0.7rem;

  margin: -3px 0;
  border-width: 1px;
}

.margin-left {
  margin-left: 0.4rem;
}
</style>
