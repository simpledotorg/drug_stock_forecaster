<template>
  <button class="see-more-button hide-on-print" @click="store.showCalculation = !store.showCalculation">
    {{ store.showCalculation ? 'Hide' : 'Show' }} montly breakdown
    <span class="see-more-chevron" :class="{ 'is-open': !store.showCalculation }" aria-hidden="true">{{ store.showCalculation ? '-' : '+' }}</span>
  </button>
  <div v-if="store.showCalculation">
    <h3>Monthly breakdown</h3>
    <table>
      <thead>
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
</template>

<script setup>
import { useDrugCalcStore } from '../stores/drugsCalculator'

const store = useDrugCalcStore()

const formatNumber = (num) => {
  return num?.toLocaleString() || 0
}

</script>

<style scoped>
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

.see-more-button {
  background-color: transparent;
  color: #0f56e4;
  font-size: 0.9re;
  font-weight: 500;
  width: 100%;
  cursor: pointer;
  padding: 8px 0;
  margin: 2rem 0 -1.2rem;
  border: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.see-more-button:hover {
  background-color: #f9f9f9;
  color: #216bff;
}

.see-more-chevron {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: 8px;
  font-size: 1.2rem;
  border-radius: 100%;
  color: #aaa;
}

.see-more-button:tabindexfocus {
  outline: 1px solid #216bff;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.1);
}
</style>
