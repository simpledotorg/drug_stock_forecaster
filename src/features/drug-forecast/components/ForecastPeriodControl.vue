<template>
  <div class="period-input-container">
    <div class="period-button-input-group hide-on-print">
      <button class="button" type="button" @click="store.forecastMonths += 1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>
      <input type="number" v-model="store.forecastMonths" class="period-input" placeholder="12" min="1" />
      <button class="button" type="button" @click="store.forecastMonths -= 1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    </div>
    <p><span class="show-on-print">{{ store.forecastMonths }}</span> month forecast</p>
  </div>
</template>

<script setup>
import { useDrugCalcStore } from '../../../stores/drugsCalculator'

const store = useDrugCalcStore()
</script>

