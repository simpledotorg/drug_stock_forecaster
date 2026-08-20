<template>
  <template v-if="!protocolHasStatin" >
    <div class="include-statins" >

      <FormField input-id="includeStatins">
        <div class="include-statins__row" >
          Include statin
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
        </div>
      </FormField>
    </div>
  </template>
</template>

<script setup>
import FormField from './FormField.vue'

defineProps({
  includeStatins: { type: Boolean, required: true },
  protocolHasStatin: { type: Boolean, required: true },
})

defineEmits(['update:includeStatins'])
</script>

<style scoped>

.include-statins {
  cursor: pointer;
}

/* FormField's <label> fills this card; UA `label { cursor: default }` overrides inheritance. */
.include-statins :deep(.form-group) {
  cursor: pointer;
}

.include-statins__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  user-select: none;
  font-weight: 600;
  font-family: var(--font-sans-spline);
  color: #000;
  font-size: 0.85rem;
}

.switch {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  width: 2.8rem;
  height: 1.4rem;
  transform: translateX(0.1rem);
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
  left: 0.1rem;
  width: 1.6rem;
  height: 1.1rem;
  border-radius: 1.1rem;
  background: #fff;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.28);
  transition: transform 0.15s ease;
}

.switch__input:checked + .switch__track {
  background: color-mix(in oklab, var(--accent2) 78%, #15803d);
}

.switch__input:checked + .switch__track::after {
  transform: translateX(1rem);
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
