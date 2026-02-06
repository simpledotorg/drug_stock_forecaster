<template>
  <div>
    <h3>Calculation</h3>
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
</style>