<template>
  <label class="form-group" :for="inputId" @click="openSelectPicker">
    <span v-if="label || $slots['label-extra']" >
      {{ label }}
      <slot name="label-extra" />
    </span>
    <slot />
  </label>
</template>

<script setup>
defineProps({
  inputId: { type: String, default: '' },
  label: { type: String, default: '' },
})

function openSelectPicker(event) {
  const select = event.currentTarget.querySelector('select:not([disabled])')
  if (!select || event.target.closest('select') === select) return
  event.preventDefault()
  select.focus()
  try {
    select.showPicker?.()
  } catch {
    // showPicker throws if the picker is already open or the UA rejects it.
  }
}
</script>

<style scoped>
.form-group {
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 0.05rem;
  background-color: #ffffff;

  padding: 0.5rem 0.8rem 0.45rem;
  border: none;
  border-radius: 14px;
  background-color: #fff;
  font-size: 0.9rem;
  box-shadow:
    /* 0 0 0 0px color-mix(in oklab, var(--ink) 5%, transparent), */
    0 2px 2px rgba(15, 23, 42, 0.06);
  transition: box-shadow 0.3s ease;
  font-family: var(--font-sans-spline);
  min-height: 2.75rem;
}

.form-group:focus-within {
  outline: none;
  box-shadow:
    0 0 0 2px var(--focus-ring),
    0 0 0 5px var(--focus-ring-glow),
    0 10px 18px rgba(15, 23, 42, 0.08);
}

span {
  font-weight: 600;
  font-family: var(--font-sans-spline);
  color: #454545;
  font-size: 0.7rem;
}

:deep(.input) {
  /* padding: 0.7rem 0.7rem; */
  border: none;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  /* background-color: #fff; */
  font-size: 1.1rem;
  /* box-shadow:
    0 0 0 1px color-mix(in oklab, var(--ink) 14%, transparent),
    0 1px 2px rgba(15, 23, 42, 0.06); */
  transition: box-shadow 0.3s ease;
  font-family: var(--font-sans-spline);
  font-weight: 500;
  padding: 0rem;
}

:deep(.input-select) {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  /* padding-right: 1rem; */
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='black'><path d='M5 7l5 5 5-5'/></svg>");
  background-repeat: no-repeat;
  background-position: right top;
  background-size: 1rem;
  font-size: 0.95rem;
}

:deep(.input:disabled) {
  background-color: #eee;
  color: #444;
  cursor: not-allowed;
  box-shadow: 0 0 0 1px #ccc;
}

:deep(.input:focus) {
  outline: none;
  box-shadow: none;
}

:deep(.input::placeholder) {
  color: #999;
  font-size: 0.9rem;
}

:deep(.input:not(:disabled):not(.input--optional):placeholder-shown),
:deep(.input:not(:disabled):not(.input--optional):invalid) {
  box-shadow:
    0 0 0 2px color-mix(in oklab, #e11d48 65%, transparent),
    0 0 0 1px color-mix(in oklab, #e11d48 45%, transparent),
    0 2px 8px rgba(225, 29, 72, 0.14);
  background-color: color-mix(in oklab, var(--paper, #fff) 86%, #fecdd3 14%);
}

:deep(.input:not(:disabled):not(.input--optional):placeholder-shown:focus),
:deep(.input:not(:disabled):not(.input--optional):invalid:focus) {
  box-shadow:
    0 0 0 2px var(--focus-ring),
    0 0 0 5px var(--focus-ring-glow),
    0 0 0 1px color-mix(in oklab, #e11d48 40%, transparent),
    0 10px 18px rgba(15, 23, 42, 0.08);
  background-color: var(--paper, #fff);
}

@media print {
  .form-group {
    gap: 0.2rem;
    break-inside: avoid;
    padding: 0.7rem 0.7rem;
    border-radius: 12px;
    font-size: 0.9rem;
  }

  label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #000;
  }

  :deep(.input) {
    padding: 0.38rem 0.5rem;
    border-radius: 6px;
    background: transparent !important;
    box-shadow: none !important;
    border: 1px solid rgba(0, 0, 0, 0.55) !important;
    font-size: 0.92rem;
    color: #000;
    height: auto;
  }

  :deep(.input::placeholder) {
    color: transparent !important;
  }

  :deep(.input-select) {
    background-image: none !important;
    padding-right: 0.25rem;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }
}


</style>
