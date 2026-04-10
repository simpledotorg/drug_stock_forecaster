<template>
  <div v-if="rows.length" class="step-cost-block">
    <h3>Cost by protocol step</h3>
    <!-- <p class="small-text footnote">
      Each drug on a step is costed on the same basis as the monthly breakdown (full line allocation per drug).
    </p> -->
    <div class="table-scroll">
      <table>
        <thead>
          <tr>
            <th class="row-label">Step</th>
            <th class="row-label treatment-col">Treatment added</th>
            <th>Patients treated (%)</th>
            <th>
              Step cost
              <span v-if="store.currencySymbol !== ''"> ({{ store.currencySymbol }})</span>
            </th>
            <th>
              Cumulative cost
              <span v-if="store.currencySymbol !== ''"> ({{ store.currencySymbol }})</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="'step-cost-' + row.index">
            <th class="row-label" scope="row">{{ row.index }}</th>
            <td class="align-left" scope="row"><span v-if="row.index > 1">+ </span>{{ row.stepLabel }}</td>
            <td class="number-cell">
              <template v-if="row.controlAssumptions != null">{{ formatNumber(row.controlAssumptions) }}%</template>
              <template v-else>—</template>
            </td>
            <td class="number-cell">
              <template v-if="row.stepCost != null">
                <span v-if="store.currencySymbolPosition === 'start'"
                  class="currency-symbol-before currency-symbol-color">{{ store.currencySymbol }}</span>{{
                    formatNumber(row.stepCost)
                }}<span v-if="store.currencySymbolPosition === 'end'"
                  class="currency-symbol-after currency-symbol-color">{{ store.currencySymbol }}</span>
              </template>
              <template v-else>—</template>
            </td>
            <td class="number-cell">
              <template v-if="row.cumulativeCost != null">
                <span v-if="store.currencySymbolPosition === 'start'"
                  class="currency-symbol-before currency-symbol-color">{{ store.currencySymbol }}</span>{{
                    formatNumber(row.cumulativeCost)
                }}<span v-if="store.currencySymbolPosition === 'end'"
                  class="currency-symbol-after currency-symbol-color">{{ store.currencySymbol }}</span>
              </template>
              <template v-else>—</template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="small-text align-right">
      <span>Step cost reflects the drug added at each step, applied to the proportion of patients who reach it.<br /></span>
      <span v-if="store.dashboardDrugSections.otherOnlyDrugs.length">Excludes "Other drugs" from the total cost
        calculation.<br /></span>
        <span>Calculations use a base drug strength.</span>
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDrugCalcStore } from '../../../stores/drugsCalculator'
import { protocolStepCostRows } from '../utils/forecastMath'
import { formatNumber } from '../utils/format'

const store = useDrugCalcStore()

const rows = computed(() =>
  protocolStepCostRows(store.stepForecasts, store.drugCatalog, store.activeProtocol?.steps),
)
</script>

<style scoped>
/* Aligned with `CalculationBreakdown.vue` table styling */
.step-cost-block {
  padding-top: 0;
}

h3 {
  margin-top: 4rem;
  margin-bottom: 0.5rem;
}

.footnote {
  margin: 0.5rem 0 0;
  color: var(--muted);
  line-height: 1.4;
  max-width: 52rem;
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
}

.table-scroll {
  width: 100%;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
}

.table-scroll table {
  min-width: 480px;
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
  vertical-align: middle;
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

.treatment-col {
  min-width: 200px;
  max-width: 28rem;
}

td {
  text-align: right;
}

.number-cell {
  font-family: var(--font-mono-table);
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

.align-right {
  text-align: right;
}

.align-left {
  text-align: left;
}
</style>
