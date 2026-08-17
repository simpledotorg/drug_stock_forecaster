<template>
  <div v-if="!protocolHasStatin" class="form-group include-statins">
    <label class="include-statins__row" for="includeStatins">
      Include statin?
      <span class="switch">
        <input
          id="includeStatins"
          class="switch__input"
          type="checkbox"
          role="switch"
          :checked="includeStatins"
          :aria-checked="includeStatins"
          @change="$emit('update:includeStatins', $event.target.checked)"
        />
        <span class="switch__track" aria-hidden="true"></span>
      </span>
    </label>
  </div>
</template>

<script setup>
defineProps({
  includeStatins: { type: Boolean, required: true },
  protocolHasStatin: { type: Boolean, required: true },
})

defineEmits(['update:includeStatins'])
</script>

<style scoped>
.include-statins {
  margin-top: 0.4rem;
}

.include-statins__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  cursor: pointer;
  user-select: none;
}

.switch {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  width: 2.5rem;
  height: 1.4rem;
}

.switch__input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.switch__track {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 999px;
  background: color-mix(in oklab, var(--ink) 18%, var(--paper));
  box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--ink) 12%, transparent);
  transition: background-color 0.15s ease;
}

.switch__track::after {
  content: '';
  position: absolute;
  top: 0.15rem;
  left: 0.15rem;
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.28);
  transition: transform 0.15s ease;
}

.switch__input:checked + .switch__track {
  background: color-mix(in oklab, var(--accent2) 78%, #15803d);
}

.switch__input:checked + .switch__track::after {
  transform: translateX(1.1rem);
}

.switch__input:focus-visible + .switch__track {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}

@media print {
  .include-statins__row {
    color: #000;
    font-weight: 600;
    font-size: 0.8rem;
  }

  .switch__track {
    background: transparent !important;
    box-shadow: none;
    border: 1px solid rgba(0, 0, 0, 0.55);
  }

  .switch__track::after {
    box-shadow: none;
    border: 1px solid rgba(0, 0, 0, 0.55);
  }
}
</style>
