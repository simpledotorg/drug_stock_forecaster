<template>
  <!-- <div class="breakdown-toggle-wrap hide-on-print">
    <button type="button" class="forecast-chip forecast-chip--breakdown" :class="{ 'is-open': store.showCalculation }"
      :aria-expanded="store.showCalculation" @click="store.showCalculation = !store.showCalculation">
      <span class="forecast-chip__chev" aria-hidden="true">
        <svg class="forecast-chip__chev-icon" viewBox="0 0 11 11" fill="none">
          <path d="M2 4L5.5 7.5L9 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </span>
      <span class="forecast-chip__muted">{{ store.showCalculation ? 'Hide' : 'Show' }} monthly breakdown</span>
    </button>
  </div> -->
  <div class="content-padding">
    <h3>Monthly breakdown</h3>
    <p class="small-text">View the monthly breakdown of the drug stock forecast.</p>
    <p class="small-text">Doses are cumulative. Each column shows what's added at that step, not the full regimen.</p>
    <div class="table-scroll">
      <table>
        <thead>
          <tr class="step-header-row">
            <td colspan="3" class="blank-header"></td>
            <td v-for="(_, idx) in store.stepForecasts" :key="'stt' + idx" class="step-col">
              <span class="step-tooltip-wrap" tabindex="0">
                <span class="step-tooltip-text">Step {{ idx + 1 }}</span>
                <span class="step-tooltip-bubble hide-on-print" role="tooltip">
                  {{ stepTooltipText(idx) }}
                </span>
              </span>
            </td>
            <td v-for="(_, idx) in store.activeOtherDrugs" :key="'ostep-' + idx" class="step-header-filler"
              aria-hidden="true" />
          </tr>
          <tr>
            <th class="row-label">Month</th>
            <th>Cumulative enrolment</th>
            <th>Patients treated</th>
            <th v-for="(step, idx) in store.activeProtocol?.steps ?? []" :key="'s' + idx">{{ step.label }}</th>
            <th v-for="(line, idx) in store.activeOtherDrugs" :key="'o' + idx" class="other-col">
              {{ line.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="month in store.yearlyBreakdown" :key="month.month">
            <th class="row-label" scope="row">{{ month.month }}</th>
            <td class="number-cell">{{ formatNumber(month.expectedCumulativeEnrolment) }}</td>
            <td class="number-cell">{{ formatNumber(month.patientsTreatedFromAdherence) }}</td>
            <td v-for="(t, idx) in month.stepTablets" :key="'st' + idx" class="number-cell">{{ formatNumber(t) }}</td>
            <td v-for="(t, idx) in month.otherDrugTablets" :key="'ot' + idx" class="number-cell other-col">{{
              formatNumber(t) }}</td>
          </tr>
          <tr class="total-row">
            <th class="row-label" scope="row">Total</th>
            <td class="number-cell"></td>
            <td class="number-cell"></td>
            <td v-for="(step, idx) in store.stepForecasts" :key="'stt' + idx" class="number-cell">{{
              formatNumber(step.total) }}</td>
            <td v-for="(step, idx) in store.otherDrugForecasts" :key="'ott' + idx" class="number-cell other-col">{{
              formatNumber(step.total) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useDrugCalcStore } from '../stores/drugsCalculator'

const store = useDrugCalcStore()

const formatNumber = (num) => {
  return num?.toLocaleString() || 0
}

function stepTooltipText(idx) {
  const label = store.activeProtocol?.steps?.[idx]?.label
  return label
    ? `Monthly tablet counts for ${label}.`
    : 'Monthly tablets for this treatment step.'
}

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
}

.table-scroll {
  width: 100%;
  overflow-x: auto;
  overflow-y: visible;
  -webkit-overflow-scrolling: touch;
}

.table-scroll table {
  min-width: 760px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.75rem;
}

th,
td {
  border: none;
  border-bottom: 1px solid #ddd;
  padding: 0.5rem 0.75rem;
  vertical-align: top;
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

.number-cell {
  font-family: var(--font-mono-table);
  font-size: 0.95rem;
  font-weight: 500;
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
  padding-top: 0.5rem;
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
  max-width: min(240px, 70vw);
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

.step-tooltip-bubble::before {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -6px;
  border: 6px solid transparent;
  border-top-color: #2d2d2d;
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

.total-row .row-label {
  font-weight: 600;
}

.total-row .number-cell {
  font-weight: 600;
}

.breakdown-toggle-wrap {
  margin: 2rem 0 -1.2rem;
}
</style>
