<template>
    <div>
        <h3>Year forecast</h3>
        <p>Estimated cost</p>
        <table class="total-cost">
            <tbody>
                <tr class="total-cost-row">
                    <td>{{formatNumber(store.costForYearForecast.amlodipine5mgCost + store.costForYearForecast.losartan50mgCost + store.costForYearForecast.hydrochlorothiazide25mgCost)}}</td>
                </tr>
            </tbody>
        </table>
        <br/>
        <p>Estimated tablets</p>
        <table>
            <thead>
                <tr>
                    <th>Amlodipine 5mg</th>
                    <th>Losartan 50mg</th>
                    <th>Hydrochlorothiazide 25mg</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ formatNumber(store.tabletsForYearForecast.amlodipine5mgTabletsTotal) }}</td>
                    <td>{{ formatNumber(store.tabletsForYearForecast.losartan50mgTabletsTotal) }}</td>
                    <td>{{ formatNumber(store.tabletsForYearForecast.hydrochlorothiazide25mgTabletsTotal) }}</td>
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
    margin-top: 0.75rem;
}

th, td {
    border: 1px solid #ddd;
    padding: 0.5rem 0.75rem;
    text-align: left;
    width: 33.33%;
}

.total-cost {
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
    width: 33.33%;
}

</style>