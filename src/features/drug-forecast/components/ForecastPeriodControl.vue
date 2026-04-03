<template>
  <div class="chip-wrap" ref="wrapRef">
    <div class="v1-control" :class="{ open: isOpen }" @click="toggleDropdown">
      <span class="v1-chev">
        <svg class="chev-icon" viewBox="0 0 11 11" fill="none">
          <path d="M2 4L5.5 7.5L9 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </span>
      <span class="v1-val">{{ modelValue }} month</span>
      <span class="s-muted">forecast</span>
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
        <label>Custom</label>
        <input type="number" placeholder="?" min="1" max="120" :value="isCustom ? modelValue : ''"
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

const isCustom = computed(() => !PRESETS.includes(props.modelValue))

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function closeDropdown() {
  isOpen.value = false
}

function selectPreset(val) {
  emit('update:modelValue', val)
  setTimeout(closeDropdown, 140)
}

function onCustomInput(e) {
  const val = parseInt(e.target.value)
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

/* ── Trigger ── */
.v1-control {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 4px 8px 4px 6px;
  border-radius: 8px;
  transition: background 0.15s;
  margin: -4px 0 -4px -6px;
  user-select: none;
}

.v1-control:hover,
.v1-control.open {
  background: rgba(0, 0, 0, 0.05);
}

/* ── Chevron ── */
.v1-chev {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: #888;
  transition: color 0.15s;
}

.v1-control:hover .v1-chev,
.v1-control.open .v1-chev {
  color: #555;
}

.chev-icon {
  width: 11px;
  height: 11px;
  transition: transform 0.18s;
}

.v1-control.open .chev-icon {
  transform: rotate(-90deg);
}

/* ── Value label ── */
.v1-val {
  font-size: 15px;
  font-weight: 500;
  color: #111;
  border-bottom: 1px dashed #bbb;
  line-height: 1.5;
  padding: 0 1px;
  white-space: nowrap;
  transition: border-color 0.15s;
}

.v1-control:hover .v1-val,
.v1-control.open .v1-val {
  /* border-bottom-style: solid; */
  border-bottom-color: transparent;
}



/* ── Dropdown panel ── */
.dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #fff;
  border: 0.5px solid rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  z-index: 30;
  display: none;
  width: 224px;
}

.dropdown.open {
  display: block;
}

.dd-heading {
  font-size: 10px;
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
  border: 0.5px solid rgba(0, 0, 0, 0.12);
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
  background: #111;
  border-color: #111;
}

.pv {
  font-size: 13px;
  font-weight: 500;
  color: #111;
  line-height: 1.2;
}

.pu {
  font-size: 9px;
  color: #aaa;
}

.preset-row button.active .pv {
  color: #fff;
}

.preset-row button.active .pu {
  color: rgba(255, 255, 255, 0.5);
}

/* ── Custom input row ── */
.custom-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 14px 12px;
}

.custom-row label {
  font-size: 12px;
  color: #888;
  flex-shrink: 0;
}

.custom-row input[type='number'] {
  width: 52px;
  padding: 4px 6px;
  font-size: 13px;
  border: 0.5px solid rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.03);
  color: #111;
  font-family: inherit;
  -moz-appearance: textfield;
  outline: none;
  text-align: center;
}

.custom-row input[type='number']:focus {
  border-color: rgba(0, 0, 0, 0.3);
}

.custom-row input[type='number']::-webkit-inner-spin-button,
.custom-row input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
}

.unit {
  font-size: 12px;
  color: #888;
}

/* ── Print ── */
@media print {

  .v1-chev,
  .dropdown {
    display: none !important;
  }

  .v1-val {
    border: none !important;
  }

  .v1-control {
    background: transparent !important;
    padding: 0 !important;
    margin: 0 !important;
    cursor: default;
  }
}

@media not print {

  /* ── Muted suffix ── */
  .s-muted {
    font-size: 14px;
    color: #888;
    white-space: nowrap;
  }
}
</style>