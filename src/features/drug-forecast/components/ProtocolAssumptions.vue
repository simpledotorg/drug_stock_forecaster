<template>
  <CollapsibleSection v-if="activeProtocol" title="Protocol assumptions" :meta="activeProtocol.name"
    :defaultOpen="false">
    <template #actions>
      <label class="print-include-toggle" @click.stop>
        <input v-model="includeInPrint" type="checkbox" class="print-include-toggle__input" />
        <span class="print-include-toggle__text">Include in printout</span>
      </label>
    </template>
    <div class="content-padding">

      <h3>Treatment protocol control assumptions</h3>
      <p class="small-text">Important: The tool is customized based on real-world experience with treatment protocols. Control rates at each step reflect experience from 1M+ patients and can be updated with local data. Any future protocol changes will require formula adjustments — ideally updated and redistributed at the national/provincial level.</p>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th class="left-align">Step</th>
              <th class="left-align">Treatment</th>
              <th class="number-header">Control assumption (%)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(step, idx) in activeProtocol.steps" :key="activeProtocol.id + '-' + idx">
              <td class="step-cell left-align">{{ idx + 1 }}</td>
              <td class="regimen-cell left-align">{{ step.fullRegimen ?? step.label }}</td>
              <td>
                <input
                  v-model.number="step.percentage"
                  class="input input--pct hide-on-print"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  inputmode="numeric"
                  required
                />
                <span class="show-on-print">{{ step.percentage }}</span>
                <span>%</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="actions-row">
        <button v-if="isActiveProtocolAssumptionsDirty" class="reset-btn" type="button"
          @click="resetActiveProtocolAssumptions">
          Reset assumptions
        </button>
      </div>
    </div>
  </CollapsibleSection>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import CollapsibleSection from '../../../components/CollapsibleSection.vue'
import { useDrugCalcStore } from '../../../stores/drugsCalculator'

/** Synced with parent `App.vue` for `@media print` visibility via `.print-hide`. */
const includeInPrint = defineModel('includeInPrint', { type: Boolean, default: false })

const store = useDrugCalcStore()
const { activeProtocol, isActiveProtocolAssumptionsDirty } = storeToRefs(store)
const { resetActiveProtocolAssumptions } = store
</script>

<style scoped>
h3 {
  margin-top: 0;
  margin-bottom: 0;
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
  color: #666;
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
  color: #666;
  text-decoration: underline;
  text-decoration-style: dashed;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  text-decoration-color: #888;
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

.total-row th,
.total-row td {
  font-weight: 700;
}

.breakdown-toggle-wrap {
  margin: 2rem 0 -1.2rem;
}

.left-align {
  text-align: left;
}

.input--pct {
  width: 72px;
  text-align: right;
  height: 34px;
  padding: 0.4rem 0.7rem;
  margin: -3px 0;
  border-width: 1px;
}
</style>
