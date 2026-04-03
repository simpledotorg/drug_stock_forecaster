<template>
  <div class="breakdown-toggle-wrap hide-on-print">
    <button
      type="button"
      class="forecast-chip forecast-chip--breakdown"
      :class="{ 'is-open': store.showCalculation }"
      :aria-expanded="store.showCalculation"
      @click="store.showCalculation = !store.showCalculation"
    >
      <span class="forecast-chip__chev" aria-hidden="true">
        <svg class="forecast-chip__chev-icon" viewBox="0 0 11 11" fill="none">
          <path
            d="M2 4L5.5 7.5L9 4"
            stroke="currentColor"
            stroke-width="1.4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
      <span class="forecast-chip__val">{{ store.showCalculation ? 'Hide' : 'Show' }}</span>
      <span class="forecast-chip__muted">monthly breakdown</span>
    </button>
  </div>
  <div v-if="store.showCalculation">
    <h3>Monthly breakdown</h3>
    <div class="table-scroll">
    <table>
      <thead>
        <tr>
          <td colspan="3" class="blank-header"></td>
          <td v-for="(step, idx) in store.stepForecasts" :key="'stt' + idx" class="step-col">Step {{ idx + 1 }}</td>
        </tr>
        <tr>
          <th>Month</th>
          <th>Cumulative enrolment</th>
          <th>Patients treated</th>
          <th v-for="(step, idx) in store.activeProtocol?.steps ?? []" :key="'s' + idx">{{ step.label }}</th>
          <th
            v-for="(line, idx) in store.activeOtherDrugs"
            :key="'o' + idx"
            class="other-col"
          >
            {{ line.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="month in store.yearlyBreakdown" :key="month.month">
          <td>{{ month.month }}</td>
          <td>{{ formatNumber(month.expectedCumulativeEnrolment) }}</td>
          <td>{{ formatNumber(month.patientsTreatedFromAdherence) }}</td>
          <td v-for="(t, idx) in month.stepTablets" :key="'st' + idx">{{ formatNumber(t) }}</td>
          <td v-for="(t, idx) in month.otherDrugTablets" :key="'ot' + idx" class="other-col">{{ formatNumber(t) }}</td>
        </tr>
        <tr class="total-row">
          <td>Total</td>
          <td></td>
          <td></td>
          <td v-for="(step, idx) in store.stepForecasts" :key="'stt' + idx">{{ formatNumber(step.total) }}</td>
          <td v-for="(step, idx) in store.otherDrugForecasts" :key="'ott' + idx" class="other-col">{{ formatNumber(step.total) }}</td>
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

</script>

<style scoped>
.table-scroll {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.table-scroll table {
  min-width: 760px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 0.5rem 0.75rem;
  text-align: right;
  vertical-align: top;
}

thead th {
  font-weight: 600;
}

.other-col {
  background: #faf8fc;
}

.total-row {
  font-weight: bold;
  background-color: #f0f0f0;
}

.breakdown-toggle-wrap {
  margin: 2rem 0 -1.2rem;
}
</style>
