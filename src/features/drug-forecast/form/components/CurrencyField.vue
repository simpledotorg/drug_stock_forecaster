<template>
  <FormField input-id="currencySymbol" label="Currency symbol" class="hide-on-print">
    <template #label-extra>
      <span class="optional">optional</span>
    </template>
    <div class="currency-group">
      <input id="currencySymbol" :value="currencySymbol" type="text" class="input input--optional" placeholder="$"
        @input="$emit('update:currencySymbol', $event.target.value)" />
      <div v-if="showPositionControl" class="segmented-control" role="group" aria-label="Currency symbol position">
        <button type="button" class="flex-col segmented-control__btn segmented-control__btn--left"
          :class="{ 'is-selected': currencySymbolPosition === 'start' }"
          :aria-pressed="currencySymbolPosition === 'start'" @click="$emit('update:currencySymbolPosition', 'start')">
          <!-- <span class="currency-symbol">{{ currencySymbol }} 10</span> -->
          <span class="small-text">{{ currencySymbol || "$"}}100</span>
        </button>
        <button type="button" class="flex-col segmented-control__btn segmented-control__btn--right"
          :class="{ 'is-selected': currencySymbolPosition === 'end' }" :aria-pressed="currencySymbolPosition === 'end'"
          @click="$emit('update:currencySymbolPosition', 'end')">
          <!-- <span class="currency-symbol">10 {{ currencySymbol }}</span> -->
          <span class="small-text">100<span class="">{{ currencySymbol || "$"}}</span></span>
        </button>
      </div>
    </div>
  </FormField>
</template>

<script setup>
import { computed } from 'vue'
import FormField from './FormField.vue'

const props = defineProps({
  currencySymbol: { type: String, required: true },
  currencySymbolPosition: { type: String, required: true },
  defaultCurrencySymbol: { type: String, default: '' },
})

defineEmits(['update:currencySymbol', 'update:currencySymbolPosition'])

const showPositionControl = computed(() => {
  const defaultSymbol = props.defaultCurrencySymbol
  if (defaultSymbol && props.currencySymbol === defaultSymbol) return false
  return true
})
</script>

<style scoped>
.small-text {
  font-size: 0.65rem;
  font-weight: 500;
  color: #666;
}

.color-black {
  color: #000;
  font-weight: 600;
}

.currency-symbol {
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0;
  margin-bottom: -0.3rem;
  color: #000;
}

.flex-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.segmented-control {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 110px;
  max-width: 140px;
  border: 1px solid color-mix(in oklab, var(--ink) 14%, transparent);
  border-radius: 12px;
  background: color-mix(in oklab, var(--paper) 94%, var(--bg1));
  overflow: visible;
  background: #00000010;
  height: 1.32rem;
}

/* Two real buttons so Tab visits Before and After separately (native radio = one tab stop per group). */
.segmented-control__btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 0;
  min-width: 0;
  margin: 1px;
  height: 1.1rem;
  border: none;
  background: transparent;
  font: inherit;
  font-weight: 600;
  font-size: 0.8rem;
  color: color-mix(in oklab, var(--ink) 88%, var(--muted));
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 0.15s ease, color 0.15s ease;
  border-radius: 100px;
}

.segmented-control__btn:focus {
  outline: none;
}

.segmented-control__btn:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: -2px;
  z-index: 1;
}

/* .segmented-control__btn--left {
  border-radius: 100px;
  /* border-top-left-radius: 11px; */
  /* border-bottom-left-radius: 11px; */
/* } */

/* .segmented-control__btn--right {
  border-top-right-radius: 11px;
  border-bottom-right-radius: 11px;
} */

.segmented-control__btn.is-selected {
  /* border: 2px solid color-mix(in oklab, var(--accent2) 60%, var(--paper)); */
  color: var(--ink);
  background: #fff;
  box-shadow: 0 0 2px 1px color-mix(in oklab, var(--ink) 8%, transparent);

}

.currency-group {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.5rem;
}

.currency-group>.input {
  min-width: 0;
  width: 100%;
}

@media print {
  :deep(.segmented-control) {
    max-width: none;
    border: 1px solid rgba(0, 0, 0, 0.35);
    background: transparent;
  }

  :deep(.segmented-control__btn) {
    padding: 0.35rem 0.5rem;
    font-size: 0.78rem;
    color: #000;
  }

  :deep(.segmented-control__btn.is-selected) {
    border: 1px solid rgba(0, 0, 0, 0.08);
  }
}
</style>
