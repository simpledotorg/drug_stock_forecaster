<template>
  <div class="chip-wrap" ref="wrapRef">
    <div class="forecast-chip" :class="{ 'is-open': isOpen }" @click="toggleDropdown">
      <span class="forecast-chip__chev">
        <svg class="forecast-chip__chev-icon" viewBox="0 0 11 11" fill="none">
          <path d="M2 4L5.5 7.5L9 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </span>
      <span class="forecast-chip__val">{{ modelValue }} month</span>
      <span class="forecast-chip__muted">forecast</span>
    </div>

    <div class="dropdown" :class="{ open: isOpen }">
      <div class="dd-heading">Forecast period</div>
      <div class="preset-row">
        <button v-for="preset in PRESETS" :key="preset" :class="{ active: modelValue === preset }"
          @click="selectPreset(preset)">
          <span class="pv">{{ preset }}</span>
          <span class="pu">mo</span>
        </button>
      </div>
      <div class="dd-sep" />
      <div class="custom-row">
        <label>Custom:</label>
        <input type="number" placeholder="#" min="1" max="120" :value="customInputDisplay"
          @input="onCustomInput" @keydown.enter="closeDropdown" />
        <span class="unit">months</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 12,
  },
})

const emit = defineEmits(['update:modelValue'])

const PRESETS = [3, 6, 12, 18, 24]

const isOpen = ref(false)
const wrapRef = ref(null)

/** When false, custom field stays empty (value came from a preset chip). When true, show modelValue (typed or non-preset). */
const valueFromCustomInput = ref(!PRESETS.includes(props.modelValue))

const customInputDisplay = computed(() =>
  valueFromCustomInput.value ? String(props.modelValue) : '',
)

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function closeDropdown() {
  isOpen.value = false
}

function selectPreset(val) {
  valueFromCustomInput.value = false
  emit('update:modelValue', val)
  setTimeout(closeDropdown, 140)
}

function onCustomInput(e) {
  valueFromCustomInput.value = true
  const val = parseInt(e.target.value, 10)
  if (val > 0 && val <= 120) {
    emit('update:modelValue', val)
  }
}

function onOutsideClick(e) {
  if (wrapRef.value && !wrapRef.value.contains(e.target)) {
    closeDropdown()
  }
}

onMounted(() => document.addEventListener('click', onOutsideClick))
onUnmounted(() => document.removeEventListener('click', onOutsideClick))
</script>

<style scoped>
.chip-wrap {
  position: relative;
  flex-shrink: 0;
}

@media print {
  .chip-wrap {
    margin-top: -1.5rem;
  }
}

/* ── Dropdown panel ── */
.dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: var(--shadow-1);
  border-radius: 12px;
  z-index: 30;
  display: none;
  width: 224px;
}

.dropdown.open {
  display: block;
}

.dd-heading {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #aaa;
  padding: 12px 14px 8px;
}

.dd-sep {
  height: 0.5px;
  background: rgba(0, 0, 0, 0.08);
  margin: 6px 14px 8px;
}

/* ── Preset grid ── */
.preset-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 4px;
  padding: 0 14px;
}

.preset-row button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 7px 2px 5px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.1s;
  gap: 1px;
}

.preset-row button:hover {
  background: rgba(0, 0, 0, 0.04);
}

.preset-row button.active {
  /* Match sidebar segmented-control selected chip */
  background: color-mix(in oklab, var(--accent2) 32%, var(--paper));
  border-color: color-mix(in oklab, var(--accent2) 50%, var(--faint));
}

.pv {
  font-size: 15px;
  font-weight: 500;
  color: #111;
  line-height: 1.2;
}

.pu {
  font-size: 11px;
  color: #aaa;
}

.preset-row button.active .pv {
  color: var(--ink);
}

.preset-row button.active .pu {
  color: var(--ink);
}

/* ── Custom input row ── */
.custom-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 14px 12px;
}

.custom-row label {
  font-size: 14px;
  color: #888;
  flex-shrink: 0;
}

.custom-row input[type='number'] {
  width: 52px;
  padding: 4px 6px;
  font-size: 15px;
  border: none;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.03);
  color: #111;
  font-family: inherit;
  -moz-appearance: textfield;
  outline: none;
  text-align: center;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.15s ease;
}

.custom-row input[type='number']:focus {
  box-shadow:
    0 0 0 2px var(--focus-ring),
    0 0 0 5px var(--focus-ring-glow);
}

.custom-row input[type='number']::-webkit-inner-spin-button,
.custom-row input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
}

.unit {
  font-size: 14px;
  color: #888;
}

/* ── Print ── */
@media print {
  .dropdown {
    display: none !important;
  }
}
</style>