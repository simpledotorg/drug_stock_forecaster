<template>
    <div>
        <!-- <h3>Estimated cost</h3> -->
        <p class="summary-text">Estimated total cost of <strong><span v-if="store.currencySymbolPosition === 'start'">{{ store.currencySymbol }}</span>{{ store.costForYearForecast.amlodipine5mgCost && store.costForYearForecast.losartan50mgCost && store.costForYearForecast.hydrochlorothiazide25mgCost ? formatNumber(store.costForYearForecast.amlodipine5mgCost + store.costForYearForecast.losartan50mgCost + store.costForYearForecast.hydrochlorothiazide25mgCost) : "Missing tablet costs" }}<span v-if="store.currencySymbolPosition === 'end'">{{ store.currencySymbol }}</span></strong> for {{ store.forecastMonths }} months of treatment</p>
        <!-- <table class="total-cost"> -->
            <!-- <thead>
                <tr>
                    <th>Total cost</th>
                </tr>
            </thead> -->
            <!-- <tbody>
                <tr class="total-cost-row" :class="{ 'missing-costs': !store.costForYearForecast.amlodipine5mgCost || !store.costForYearForecast.losartan50mgCost || !store.costForYearForecast.hydrochlorothiazide25mgCost }">
                    <th>Total cost</th>
                    <td>{{ store.costForYearForecast.amlodipine5mgCost && store.costForYearForecast.losartan50mgCost && store.costForYearForecast.hydrochlorothiazide25mgCost ? formatNumber(store.costForYearForecast.amlodipine5mgCost + store.costForYearForecast.losartan50mgCost + store.costForYearForecast.hydrochlorothiazide25mgCost) : "Missing tablet costs" }}</td>
                </tr>
            </tbody>
        </table>
        <br/> -->
        <!-- <div v-if="hasCosts" class="pie-chart-section">
            <ul class="pie-legend">
                <li><span class="swatch swatch-amlodipine"></span> Amlodipine 5mg ({{ pieData.amlodipinePct }}%)</li>
                <li><span class="swatch swatch-losartan"></span> Losartan 50mg ({{ pieData.losartanPct }}%)</li>
                <li><span class="swatch swatch-hctz"></span> Hydrochlorothiazide 25mg ({{ pieData.hctzPct }}%)</li>
            </ul>
            <div class="pie-chart" :style="{ background: pieGradient }"></div>
        </div> -->

        <table>
            <thead>
                <tr>
                    <th class="blank-header"></th>
                    <th>Tablets</th>
                    <th>Cost ({{ store.currencySymbol }})</th>
                </tr>
            </thead>
            <tbody>
                <tr class="total-row">
                    <th>Total</th>
                    <td class="number-cell">{{ formatNumber(store.tabletsForYearForecast.amlodipine5mgTabletsTotal + store.tabletsForYearForecast.losartan50mgTabletsTotal + store.tabletsForYearForecast.hydrochlorothiazide25mgTabletsTotal) }}</td>
                    <td class="number-cell"><span v-if="store.currencySymbolPosition === 'start'" class="currency-symbol-before currency-symbol-color">{{ store.currencySymbol }}</span>{{ store.costForYearForecast.amlodipine5mgCost && store.costForYearForecast.losartan50mgCost && store.costForYearForecast.hydrochlorothiazide25mgCost ? formatNumber(store.costForYearForecast.amlodipine5mgCost + store.costForYearForecast.losartan50mgCost + store.costForYearForecast.hydrochlorothiazide25mgCost) : "Missing tablet costs" }}<span v-if="store.currencySymbolPosition === 'end'" class="currency-symbol-after currency-symbol-color">{{ store.currencySymbol }}</span></td>
                </tr>
                <tr class="blank-row">
                    <td></td>
                    <td></td>   
                    <td></td>
                </tr>
                <tr>
                    <th>Amlodipine 5mg</th>
                    <td class="number-cell">{{ formatNumber(store.tabletsForYearForecast.amlodipine5mgTabletsTotal) }}</td>
                    <td class="number-cell"><span v-if="store.currencySymbolPosition === 'start'" class="currency-symbol-before currency-symbol-color">{{ store.currencySymbol}}</span>{{ formatNumber(store.costForYearForecast.amlodipine5mgCost) }}<span v-if="store.currencySymbolPosition === 'end'" class="currency-symbol-after currency-symbol-color">{{ store.currencySymbol}}</span></td>
                </tr>
                <tr>
                    <th>Losartan 50mg</th>
                    <td class="number-cell">{{ formatNumber(store.tabletsForYearForecast.losartan50mgTabletsTotal) }}</td>
                    <td class="number-cell"><span v-if="store.currencySymbolPosition === 'start'" class="currency-symbol-before currency-symbol-color">{{ store.currencySymbol}}</span>{{ formatNumber(store.costForYearForecast.losartan50mgCost) }}<span v-if="store.currencySymbolPosition === 'end'" class="currency-symbol-after currency-symbol-color">{{ store.currencySymbol}}</span></td>
                </tr>
                <tr>
                    <th>Hydrochlorothiazide 25mg</th>
                    <td class="number-cell">{{ formatNumber(store.tabletsForYearForecast.hydrochlorothiazide25mgTabletsTotal) }}</td>
                    <td class="number-cell"><span v-if="store.currencySymbolPosition === 'start'" class="currency-symbol-before currency-symbol-color">{{ store.currencySymbol}}</span>{{ formatNumber(store.costForYearForecast.hydrochlorothiazide25mgCost) }}<span v-if="store.currencySymbolPosition === 'end'" class="currency-symbol-after currency-symbol-color">{{ store.currencySymbol}}</span></td>
                </tr>
            </tbody>
        </table>



<!--         
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
                    <th>Total cost per drug</th>
                    <td class="number-cell">{{ formatNumber(store.tabletsForYearForecast.amlodipine5mgTabletsTotal * store.amoldipine5mgCost) }}</td>
                    <td class="number-cell">{{ formatNumber(store.tabletsForYearForecast.losartan50mgTabletsTotal * store.losartan50mgCost) }}</td>
                    <td class="number-cell">{{ formatNumber(store.tabletsForYearForecast.hydrochlorothiazide25mgTabletsTotal * store.hydrochlorothiazide25mgCost) }}</td>
                </tr>
            </tbody>
        </table>
        <br /> -->
        <!-- <h3>Estimated quantities</h3>
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
                </tr> -->
                <!-- <tr>
                    <th>Cartons <span class="small-text">(30 tablets per carton)</span></th>
                    <td>{{ formatNumber(Math.round(store.tabletsForYearForecast.amlodipine5mgTabletsTotal / 30)) }}</td>
                    <td>{{ formatNumber(Math.round(store.tabletsForYearForecast.losartan50mgTabletsTotal / 30)) }}</td>
                    <td>{{ formatNumber(Math.round(store.tabletsForYearForecast.hydrochlorothiazide25mgTabletsTotal / 30)) }}</td>
                </tr> -->
                <!-- <tr class="blank-row">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr> -->
                <!-- <tr>
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
                </tr> -->
            <!-- </tbody>
        </table> -->
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDrugCalcStore } from '../stores/drugsCalculator'

const store = useDrugCalcStore()

const formatNumber = (num) => {
    return num?.toLocaleString() || 0
}
// Piechart
const hasCosts = computed(() => {
    const c = store.costForYearForecast
    return c.amlodipine5mgCost && c.losartan50mgCost && c.hydrochlorothiazide25mgCost
})

const pieData = computed(() => {
    const c = store.costForYearForecast
    const total = c.amlodipine5mgCost + c.losartan50mgCost + c.hydrochlorothiazide25mgCost
    if (!total) return { amlodipinePct: 0, losartanPct: 0, hctzPct: 0 }
    const amlodipinePct = Math.round((c.amlodipine5mgCost / total) * 100)
    const losartanPct = Math.round((c.losartan50mgCost / total) * 100)
    const hctzPct = 100 - amlodipinePct - losartanPct
    return { amlodipinePct, losartanPct, hctzPct }
})

const pieGradient = computed(() => {
    const { amlodipinePct, losartanPct } = pieData.value
    const stop1 = amlodipinePct
    const stop2 = stop1 + losartanPct
    return `conic-gradient(#4a90d9 0% ${stop1}%, #e8a838 ${stop1}% ${stop2}%, #5cb85c ${stop2}% 100%)`
})
// - Piechart
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
    /* font-size: 1.25rem;
    font-weight: 600;
    color: #333; */
    width: 25%;
    /* td {
        text-align: left;
    } */
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
    background-color: #f6f6f6;
}

.total-row {
    font-weight: bold;
    background-color: #fff9d7;
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

.number-cell {
    font-family: "Roboto Mono", monospace;
    font-size: 0.95rem;
    font-weight: 500;
}


.currency-symbol-before {
    margin-right: 0.25rem;
}

.currency-symbol-after {
    margin-left: 0.25rem;
}

.currency-symbol-color {
    color: #666;
}

.summary-text {
    font-size: 1.15em;
    font-weight: 400;
    margin: 1.5rem 0 3rem;
}

.pie-chart-section {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3rem;
    margin: 4rem 0;
}

.pie-chart {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    flex-shrink: 0;
}

.pie-legend {
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 0.9rem;
}

.pie-legend li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.4rem;
}

.swatch {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 2px;
    flex-shrink: 0;
}

.swatch-amlodipine { background: #4a90d9; }
.swatch-losartan { background: #e8a838; }
.swatch-hctz { background: #5cb85c; }
</style>