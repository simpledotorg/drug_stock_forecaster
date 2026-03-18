<template>
  <button class="see-more-button" @click="store.showCalculation = !store.showCalculation">
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
          <th>Amoldipine 5mg Tablets</th>
          <th>Losartan 50mg Tablets</th>
          <th>Amlodipine 5 + Losartan 50mg Tablets</th>
          <th>Hydrochlorothiazide 25mg Tablets</th>
          <!-- <th>Unknown</th> -->
          <!-- <th>Unknown</th> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="month in store.yearlyBreakdown" :key="month.month">
          <td>{{ month.month }}</td>
          <td>{{ formatNumber(month.expectedCumulativeEnrolment) }}</td>
          <td>{{ formatNumber(month.patientsTreatedFromAdherence) }}</td>
          <td>{{ formatNumber(month.amoldipine5mgTablets) }}</td>
          <td>{{ formatNumber(month.losartan50mgTablets) }}</td>
          <td>{{ formatNumber(month.amlodipine5losartan50mgTablets) }}</td>
          <td>{{ formatNumber(month.hydrochlorothiazide25mgTablets) }}</td>
          <!-- <td>{{ formatNumber(month.unknown) }}</td> -->
          <!-- <td>{{ formatNumber(month.unknown) }}</td> -->
        </tr>
        <tr class="total-row">
          <td>Total</td>
          <td></td>
          <td></td>
          <td>{{ formatNumber(store.Step1TabletsTotal) }}</td>
          <td>{{ formatNumber(store.Step2TabletsTotal) }}</td>
          <td>{{ formatNumber(store.Step3TabletsTotal) }}</td>
          <td>{{ formatNumber(store.Step4TabletsTotal) }}</td>
          <!-- <td>{{ formatNumber(store.Step5TabletsTotal) }}</td>
            <td>{{ formatNumber(store.Step6TabletsTotal) }}</td> -->
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

/* th {
  background-color: #f0f0f0;
} */

thead th {
  font-weight: 600;
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
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border: none;
  /* border-top: 1px solid #ddd; */
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.see-more-button:hover {
  background-color: #f9f9f9;
}

.see-more-chevron {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: 8px;
  font-size: 1.2rem;
  transition: transform 0.2s ease;
  /* width: 24px;
  height: 24px; */
  /* border: 1px solid #ddd; */
  border-radius: 100%;
  /* text-box-trim: trim-both; */
  color: #aaa
}

.see-more-chevron.is-open {
  /* transform: rotate(-90deg); */
}

.see-more-button:hover {
  color: #216bff;
}

.see-more-button:tabindexfocus {
  outline: 1px solid #216bff;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.1);
}
</style>