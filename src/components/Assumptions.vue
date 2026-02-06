<template>
    <h3>Assumptions</h3>
    <div>
        <table>
            <thead>
                <th>Total population</th>
                <th>HTN prevalence in adults</th>
                <th>Treatment adherence</th>
            </thead>
            <tbody>
                <tr>
                    <td> {{ formatNumber(store.totalPopulation) }} </td>
                    <td> {{ store.prevalenceHTN }} %</td>
                    <td> {{ store.treatmentAdherence }} %</td>
                </tr>
            </tbody>
        </table>
        <br />
        <table>
            <thead>
                <th>Estimated total hypertensive adults</th>
                <th>Existing patient load</th>
                <th>Expected new enrolment for the year</th>
            </thead>
            <tbody>
                <tr>
                    <td> {{ formatNumber(store.estimatedHTNPopulation) }} </td>
                    <td> {{ formatNumber(store.existingPatients) }} </td>
                    <td> {{ formatNumber(store.targetEnrolment) }} </td>
                </tr>
            </tbody>
        </table>
        <!-- <br />
        <table>
            <thead>
                <th>Current coverage</th>
                <th>Target enrolment %</th>
            </thead>
            <tbody>
                <tr>
                    <td> {{ store.htnCoverage }} % </td>
                    <td> {{ store.targetEnrolment }} % </td>
                </tr>
            </tbody>
        </table> -->

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
    text-align: left;
    vertical-align: bottom;
    width: 33.33%;
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