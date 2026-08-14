<template>
  <div class="summary-container">
    <p class="summary-text">{{ store.forecastMonths }}-month cost forecast</p>
    <p class="summary-cost"><span v-if="store.currencySymbolPosition === 'start'">{{ store.currencySymbol }}</span>{{ store.finalCost != null ? formatNumber(store.finalCost) : 'Missing tablet costs' }}<span v-if="store.currencySymbolPosition === 'end'" class="sym-end">{{ store.currencySymbol }}</span></p>
  </div>
  <!-- <p class="summary-text">
    Estimated total cost for {{ store.forecastMonths }} months of treatment:
    <span class="final-cost">
      <strong>
        <span v-if="store.currencySymbolPosition === 'start'">{{ store.currencySymbol }}</span>
        {{ store.finalCost != null ? formatNumber(store.finalCost) : 'Missing tablet costs' }}
        <span v-if="store.currencySymbolPosition === 'end'" class="sym-end">{{ store.currencySymbol }}</span>
      </strong>
    </span>
  </p> -->
</template>

<script setup>
import { useDrugCalcStore } from '../../../stores/drugsCalculator'
import { formatNumber } from '../utils/format'

const store = useDrugCalcStore()
</script>

<style scoped>
.sym-end {
  margin-right: 0.25rem;
}

.summary-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #f3f3f3;
  border-radius: 10px;
  padding: 1.25rem 1.4rem;
  margin-top: 3.25rem;
}

.summary-text {
  margin: 0;
  /* text-align: center; */
  font-size: 0.85em;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.summary-cost {
  margin: 0;
  /* text-align: center; */
  font-size: 2.25em;
  font-weight: 600;
  /* font-family: var(--font-mono-table); */
  font-variant-numeric: tabular-nums;
  line-height: 1.05;
  letter-spacing: 0.02em;
}

@media print {
  .summary-container {
    padding: 1.25rem 1rem;
    margin-top: 2rem;
  }

  .summary-cost {
    font-size: 2.65em;
  }
}
</style>
