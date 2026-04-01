<template>
  <div class="period-input-container">
    <div class="period-field hide-on-print">
      <!-- <div class="period-field__icon" aria-hidden="true">
        <svg
          class="period-calendar-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5"
          />
        </svg>
      </div> -->
      <span id="period-field-label" class="period-field__label">
        <span class="period-field__label-line">Months to</span>
        <span class="period-field__label-line">forecast</span>
      </span>
      <div
        class="period-stepper"
        role="group"
        aria-labelledby="period-field-label"
      >
        <div class="period-stepper__value">
          <input
            id="forecast-months-input"
            :value="localInput"
            type="text"
            class="period-input"
            placeholder="12"
            inputmode="numeric"
            autocomplete="off"
            aria-labelledby="period-field-label"
            @focus="onFocus"
            @input="onInput"
            @blur="onBlur"
            @keydown.enter.prevent="blurForecastInput"
          />
        </div>
        <div class="period-stepper__stack">
          <button
            type="button"
            class="period-stepper__btn period-stepper__btn--dec"
            aria-label="Decrease months"
            :disabled="atMin"
            @click="decrement"
          >
            <svg class="period-stepper__glyph" width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M3 8h10"
                fill="none"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
              />
            </svg>
          </button>
          <button
            type="button"
            class="period-stepper__btn period-stepper__btn--inc"
            aria-label="Increase months"
            :disabled="atMax"
            @click="increment"
          >
            <svg class="period-stepper__glyph" width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M8 3v10M3 8h10"
                fill="none"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <p class="period-print-line show-on-print">{{ store.forecastMonths }} month forecast</p>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useDrugCalcStore } from '../../../stores/drugsCalculator'

/** Forecast length in months; bounds applied for URL/query safety. */
const MIN = 1
const MAX = 60

const store = useDrugCalcStore()

/** String shown in the input; decoupled from the store while editing so the field can be cleared mid-typing. */
const localInput = ref('')
const isEditing = ref(false)

const atMin = computed(() => displayMonths.value <= MIN)
const atMax = computed(() => displayMonths.value >= MAX)

const displayMonths = computed(() => {
  const n = Math.floor(Number(store.forecastMonths))
  if (!Number.isFinite(n)) return MIN
  return Math.min(MAX, Math.max(MIN, n))
})

function clampMonths() {
  const n = Math.floor(Number(store.forecastMonths))
  if (!Number.isFinite(n)) {
    store.forecastMonths = MIN
    return
  }
  const c = Math.min(MAX, Math.max(MIN, n))
  if (c !== store.forecastMonths) store.forecastMonths = c
}

function syncLocalFromStore() {
  localInput.value = String(store.forecastMonths)
}

function onFocus() {
  isEditing.value = true
  localInput.value = String(displayMonths.value)
}

function blurForecastInput(e) {
  e.target?.blur?.()
}

function onInput(e) {
  const raw = e.target?.value ?? ''
  localInput.value = raw
  const trimmed = raw.trim()
  if (trimmed === '') {
    return
  }
  const n = parseInt(trimmed, 10)
  if (!Number.isFinite(n)) {
    return
  }
  store.forecastMonths = Math.min(MAX, Math.max(MIN, n))
}

function onBlur() {
  isEditing.value = false
  const trimmed = localInput.value.trim()
  if (trimmed === '') {
    store.forecastMonths = MIN
  } else {
    const n = parseInt(trimmed, 10)
    if (!Number.isFinite(n)) {
      store.forecastMonths = MIN
    } else {
      store.forecastMonths = Math.min(MAX, Math.max(MIN, n))
    }
  }
  clampMonths()
  syncLocalFromStore()
}

function decrement() {
  store.forecastMonths = Math.max(MIN, displayMonths.value - 1)
  clampMonths()
  syncLocalFromStore()
}

function increment() {
  store.forecastMonths = Math.min(MAX, displayMonths.value + 1)
  clampMonths()
  syncLocalFromStore()
}

watch(
  () => store.forecastMonths,
  () => {
    clampMonths()
    if (!isEditing.value) {
      syncLocalFromStore()
    }
  },
  { immediate: true },
)
</script>

<style scoped>
/* Matches `.input` / form controls in DrugForecastForm: radius, border, focus, compact height. */
.period-input-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.35rem;
  min-width: 0;
}

.period-print-line {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--muted);
}

.period-field {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.85rem;
  min-width: 0;
}

.period-field__icon {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  padding-top: 0.1rem;
  color: var(--muted);
}

.period-calendar-icon {
  display: block;
  width: 24px;
  height: 24px;
}

.period-field__label {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-width: 4.4rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.22;
  letter-spacing: 0.01em;
  color: var(--muted);
}

.period-field__label-line {
  display: block;
}

.period-stepper {
  --period-divider: color-mix(in oklab, var(--ink) 10%, transparent);

  display: inline-flex;
  flex-direction: row;
  align-items: stretch;
  flex-shrink: 0;
  min-height: 2.65rem;
  margin-left: auto;
  border: 1px solid color-mix(in oklab, var(--ink) 14%, transparent);
  border-radius: var(--radius-md);
  background: var(--paper);
  overflow: hidden;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
}

.period-field:focus-within .period-stepper {
  outline: none;
  border-color: color-mix(in oklab, var(--accent) 45%, var(--faint));
  box-shadow:
    0 0 0 4px color-mix(in oklab, var(--accent) 22%, transparent),
    0 10px 18px rgba(15, 23, 42, 0.08);
}

.period-stepper__stack {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  flex: 0 0 auto;
  border-left: 1px solid var(--period-divider);
}

.period-stepper__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 2rem;
  width: 2.4rem;
  min-width: 2.4rem;
  min-height: 2.65rem;
  padding: 0;
  color: color-mix(in oklab, var(--ink) 88%, var(--muted));
  background: color-mix(in oklab, var(--paper) 96%, var(--bg1));
  border: none;
  border-radius: 0;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease, opacity 0.15s ease;
}

.period-stepper__btn--dec {
  border-right: 1px solid var(--period-divider);
}

.period-stepper__btn:disabled {
  cursor: not-allowed;
  opacity: 0.38;
}

.period-stepper__btn:not(:disabled):hover {
  background: color-mix(in oklab, var(--paper) 88%, var(--bg1));
}

.period-stepper__btn:not(:disabled):active {
  background: color-mix(in oklab, var(--paper) 82%, var(--bg1));
}

.period-stepper__glyph {
  display: block;
  flex-shrink: 0;
}

.period-stepper__value {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 1 auto;
  min-width: 4ch;
  width: 4.75ch;
  padding: 0.45rem 0.4rem;
}

.period-input {
  width: 100%;
  min-width: 0;
  border: none;
  background: transparent;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.01em;
  line-height: 1.25;
  text-align: center;
  color: var(--ink);
  -moz-appearance: textfield;
  appearance: textfield;
}

.period-input:focus {
  outline: none;
}

.period-input::placeholder {
  color: color-mix(in oklab, var(--muted) 72%, var(--paper));
  font-size: 0.875rem;
}

.period-input::-webkit-outer-spin-button,
.period-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

@media (max-width: 640px) {
  .period-field__label {
    min-width: 0;
    flex: 1 1 calc(100% - 2rem);
  }

  .period-stepper {
    margin-left: 0;
    width: 100%;
    max-width: 100%;
    justify-content: space-between;
  }

  .period-stepper__value {
    flex: 1 1 auto;
    width: auto;
    min-width: 4ch;
  }
}

@media print {
  .period-input-container {
    gap: 0.35rem;
  }

  .period-field__icon {
    display: none;
  }

  .period-field__label {
    display: none;
  }

  .period-stepper {
    border: none;
    box-shadow: none;
    background: transparent;
    overflow: visible;
    min-height: 0;
    height: auto;
    width: auto;
  }

  .period-stepper__stack {
    display: none !important;
  }

  .period-stepper__btn {
    display: none;
  }

  .period-stepper__value {
    border-left: none !important;
    padding: 0;
    min-width: 0;
    width: auto;
    justify-content: flex-start;
  }

  .period-input {
    display: none;
  }
}
</style>
