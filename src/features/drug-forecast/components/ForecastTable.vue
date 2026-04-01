<template>
  <div class="table-scroll">
    <table>
      <thead>
        <tr>
          <th class="blank-header"></th>
          <th>Tablets</th>
          <th>Cost <span v-if="store.currencySymbol !== ''">({{ store.currencySymbol }})</span></th>
        </tr>
      </thead>
      <tbody>
        <tr class="total-row">
          <th>Total</th>
          <td class="number-cell">{{ formatNumber(store.totalTabletsAllForecastDrugs) }}</td>
          <td class="number-cell">
            <span
              v-if="store.currencySymbolPosition === 'start'"
              class="currency-symbol-before currency-symbol-color"
              >{{ store.currencySymbol }}</span
            >{{ store.finalCost != null ? formatNumber(store.finalCost) : 'Missing tablet costs' }}<span
              v-if="store.currencySymbolPosition === 'end'"
              class="currency-symbol-after currency-symbol-color"
              >{{ store.currencySymbol }}</span
            >
          </td>
        </tr>
        <tr class="blank-row">
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr v-for="row in store.dashboardDrugSections.protocolDrugs" :key="'p-' + row.id">
          <th>{{ row.name }}</th>
          <td class="number-cell">{{ formatNumber(row.totalTablets) }}</td>
          <td class="number-cell">
            <span
              v-if="store.currencySymbolPosition === 'start'"
              class="currency-symbol-before currency-symbol-color"
              >{{ store.currencySymbol }}</span
            >{{ row.lineCost != null ? formatNumber(row.lineCost) : '—' }}<span
              v-if="store.currencySymbolPosition === 'end'"
              class="currency-symbol-after currency-symbol-color"
              >{{ store.currencySymbol }}</span
            >
          </td>
        </tr>
        <template v-if="store.dashboardDrugSections.otherOnlyDrugs.length">
          <tr class="drug-section-label">
            <th colspan="3">Other medications</th>
          </tr>
          <tr v-for="row in store.dashboardDrugSections.otherOnlyDrugs" :key="'o-' + row.id">
            <th>{{ row.name }}</th>
            <td class="number-cell">{{ formatNumber(row.totalTablets) }}</td>
            <td class="number-cell">
              <span
                v-if="store.currencySymbolPosition === 'start'"
                class="currency-symbol-before currency-symbol-color"
                >{{ store.currencySymbol }}</span
              >{{ row.lineCost != null ? formatNumber(row.lineCost) : '—' }}<span
                v-if="store.currencySymbolPosition === 'end'"
                class="currency-symbol-after currency-symbol-color"
                >{{ store.currencySymbol }}</span
              >
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { useDrugCalcStore } from '../../../stores/drugsCalculator'
import { formatNumber } from '../utils/format'

const store = useDrugCalcStore()
</script>

<style scoped>
@media print {
  .table-scroll {
    overflow: visible;
  }

  .table-scroll table {
    min-width: 0;
  }

  th,
  td {
    border: 1px solid rgba(0, 0, 0, 0.35);
  }

  .total-row {
    background: #fff;
  }

  .blank-row {
    background: transparent;
  }
}

.table-scroll {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.table-scroll table {
  min-width: 520px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.75rem;
}

th,
td {
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

.blank-header {
  border: none;
}

.blank-row {
  border: none;
  background-color: #f6f6f6;
}

.total-row {
  font-weight: bold;
  background-color: #fff9d7;
}

.number-cell {
  font-family: 'Roboto Mono', monospace;
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

.drug-section-label th {
  text-align: left;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #666;
  background: #f6f6f6;
  border-top: 1px solid #ddd;
  padding-top: 0.65rem;
  padding-bottom: 0.35rem;
}
</style>

