<template>
  <div>
    <h1>Forecast</h1>
    <table>
      <thead>
        <tr>
          <td>Month</td>
          <td>Expected Cumulative Enrolment</td>
          <td>Patients Treated From Adherence</td>
          <td>Amoldipine 5mg Tablets</td>
          <td>Losartan 50mg Tablets</td>
          <td>Amlodipine 5 + Losartan 50mg Tablets</td>
          <td>Hydrochlorothiazide 25mg Tablets</td>
          <!-- <td>Unknown</td> -->
          <!-- <td>Unknown</td> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="month in store.yearlyBreakdown" :key="month.month">
          <td>{{ month.month }}</td>
          <td>{{ month.expectedCumulativeEnrolment }}</td>
          <td>{{ month.patientsTreatedFromAdherence }}</td>
          <td>{{ month.amoldipine5mgTablets }}</td>
          <td>{{ month.losartan50mgTablets }}</td>
          <td>{{ month.amlodipine5losartan50mgTablets }}</td>
          <td>{{ month.hydrochlorothiazide25mgTablets }}</td>
          <!-- <td>{{ month.unknown }}</td> -->
          <!-- <td>{{ month.unknown }}</td> -->
        </tr>
        <tr>
            <td>Total</td>
            <td>{{ store.Step1TabletsTotal }}</td>
            <td>{{ store.Step2TabletsTotal }}</td>
            <td>{{ store.Step3TabletsTotal }}</td>
            <td>{{ store.Step4TabletsTotal }}</td>
            <td>{{ store.Step5TabletsTotal }}</td>
            <td>{{ store.Step6TabletsTotal }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { useDrugCalcStore } from '../stores/drugsCalculator'

const store = useDrugCalcStore()

</script>

<style scoped>
</style>