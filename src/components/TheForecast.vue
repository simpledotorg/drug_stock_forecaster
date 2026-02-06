<template>
    <div>
        <h3>Year forecast</h3>
        <p>Estimated total cost</p>
        <table class="total-cost">
            <tbody>
                <tr class="total-cost-row" :class="{ 'missing-costs': !store.costForYearForecast.amlodipine5mgCost || !store.costForYearForecast.losartan50mgCost || !store.costForYearForecast.hydrochlorothiazide25mgCost }">
                    <td>{{ store.costForYearForecast.amlodipine5mgCost && store.costForYearForecast.losartan50mgCost && store.costForYearForecast.hydrochlorothiazide25mgCost ? formatNumber(store.costForYearForecast.amlodipine5mgCost + store.costForYearForecast.losartan50mgCost + store.costForYearForecast.hydrochlorothiazide25mgCost) : "Missing tablet costs" }}</td>
                </tr>
            </tbody>
        </table>
        <br/>
        <p>Estimated total quantities</p>
        <table>
            <thead>
                <tr>
                    <th class="blank-header"></th>
                    <th>Amlodipine 5mg</th>
                    <th>Losartan 50mg</th>
                    <th>Hydrochlorothiazide 25mg</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th>Tablets</th>
                    <td>{{ formatNumber(store.tabletsForYearForecast.amlodipine5mgTabletsTotal) }}</td>
                    <td>{{ formatNumber(store.tabletsForYearForecast.losartan50mgTabletsTotal) }}</td>
                    <td>{{ formatNumber(store.tabletsForYearForecast.hydrochlorothiazide25mgTabletsTotal) }}</td>
                </tr>
                <tr>
                    <th>Cartons <span class="small-text">(30 tablets per carton)</span></th>
                    <td>{{ formatNumber(Math.round(store.tabletsForYearForecast.amlodipine5mgTabletsTotal / 30)) }}</td>
                    <td>{{ formatNumber(Math.round(store.tabletsForYearForecast.losartan50mgTabletsTotal / 30)) }}</td>
                    <td>{{ formatNumber(Math.round(store.tabletsForYearForecast.hydrochlorothiazide25mgTabletsTotal / 30)) }}</td>
                </tr>
                <tr class="blank-row">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <!-- <tr>
                    <th>Cost per tablet</th>
                    <td> {{ formatNumber(store.amoldipine5mgCost) }}</td>
                    <td>{{ formatNumber(store.losartan50mgCost) }}</td>
                    <td>{{ formatNumber(store.hydrochlorothiazide25mgCost) }}</td>
                </tr> -->
                <tr>
                    <th>Total cost</th>
                    <td>
                        <div class="cost-cell-container">
                            <template v-if="!store.amoldipine5mgCost">
                                <label for="amoldipine5mgCost">
                                    <p class="add-cost-label">+ ADD TABLET COST</p>
                                    <p class="small-text">- per tab</p>
                                </label>
                            </template>
                            <template v-else>
                                <p>{{ formatNumber(store.costForYearForecast.amlodipine5mgCost) }}</p>
                                <p class="small-text">{{ formatNumber(store.amoldipine5mgCost) }} per tab</p>
                            </template>
                        </div>
                    </td>
                    <td>
                        <div class="cost-cell-container">
                            <template v-if="!store.losartan50mgCost">
                                <label for="losartan50mgCost">
                                    <p class="add-cost-label">+ ADD TABLET COST</p>
                                    <p class="small-text">- per tab</p>
                                </label>
                            </template>
                            <template v-else>
                                <p>{{ formatNumber(store.costForYearForecast.losartan50mgCost) }}</p>
                                <p class="small-text">{{ formatNumber(store.losartan50mgCost) }} per tab</p>
                            </template>
                        </div>
                    </td>
                    <td>
                        <div class="cost-cell-container">
                            <template v-if="!store.hydrochlorothiazide25mgCost">
                                <label for="hydrochlorothiazide25mgCost">
                                    <p class="add-cost-label" >+ ADD TABLET COST</p>
                                    <p class="small-text">- per tab</p>
                                </label>
                            </template>
                            <template v-else>
                                <p>{{ formatNumber(store.costForYearForecast.hydrochlorothiazide25mgCost) }}</p>
                                <p class="small-text">{{ formatNumber(store.hydrochlorothiazide25mgCost) }} per tab</p>
                            </template>
                        </div>
                    </td>
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
    width: 25%;
    text-align: left;
}

thead th {
    text-align: right;
}

td {
    text-align: right;
}

.total-cost {
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
    width: 25%;
    td {
        text-align: left;
    }
}

.small-text {
    font-size: 0.8rem;
    color: #777;
    font-weight: 400;
}

.blank-header {
    border: none;
    /* border-top: 1px solid #f9f9f9;
    border-left: 1px solid #f9f9f9;
    background-color: #f9f9f9; */
}

.blank-row {
    border: none;
    background-color: #f9f9f9;
}

.cost-unit {
  margin-right: 0.25rem;
}

.cost-cell-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
    /* gap: 0.1rem; */
}

.add-cost-label {
    font-size: 0.8rem;
    line-height: 1.5rem;
    color: blue;
    font-weight: 400;
    text-align: right;
}

.missing-costs {
    color: #777;
    font-weight: 400;
    font-size: 0.8rem;
}
</style>