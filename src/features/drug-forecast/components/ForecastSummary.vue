<template>
  <p class="summary-text">
    Estimated total cost for for {{ store.forecastMonths }} months of treatment:
    <span class="final-cost">
      <strong>
        <span v-if="store.currencySymbolPosition === 'start'">{{ store.currencySymbol }}</span>
        {{ store.finalCost != null ? formatNumber(store.finalCost) : 'Missing tablet costs' }}
        <span v-if="store.currencySymbolPosition === 'end'" style="margin-right: 0.25rem;">
          {{ store.currencySymbol }}
        </span>
      </strong>
    </span>
  </p>
</template>

<script setup>
import { useDrugCalcStore } from '../../../stores/drugsCalculator'
import { formatNumber } from '../utils/format'

const store = useDrugCalcStore()
</script>

<style scoped>
.summary-text {
  font-size: 1.15em;
  font-weight: 400;
  margin: 1.5rem 0 3rem;
}

.final-cost {
  font-size: 1.2em;
  font-weight: 400;
  padding-left: 0.5rem;
}

.currency-symbol-color {
  color: #666;
}
</style>
