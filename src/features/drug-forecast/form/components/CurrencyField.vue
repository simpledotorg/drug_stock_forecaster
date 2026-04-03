<template>
  <div class="form-group hide-on-print">
    <label for="currencySymbol">Currency symbol <span class="optional">OPTIONAL</span></label>
    <div class="currency-group">
      <input
        id="currencySymbol"
        :value="currencySymbol"
        @input="$emit('update:currencySymbol', $event.target.value)"
        type="text"
        class="input"
        placeholder="$"
      />
      <div class="segmented-control" role="group" aria-label="Currency symbol position">
        <button
          type="button"
          class="segmented-control__btn segmented-control__btn--left"
          :class="{ 'is-selected': currencySymbolPosition === 'start' }"
          :aria-pressed="currencySymbolPosition === 'start'"
          @click="$emit('update:currencySymbolPosition', 'start')"
        >
          Before
        </button>
        <button
          type="button"
          class="segmented-control__btn segmented-control__btn--right"
          :class="{ 'is-selected': currencySymbolPosition === 'end' }"
          :aria-pressed="currencySymbolPosition === 'end'"
          @click="$emit('update:currencySymbolPosition', 'end')"
        >
          After
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currencySymbol: { type: String, required: true },
  currencySymbolPosition: { type: String, required: true },
})

defineEmits(['update:currencySymbol', 'update:currencySymbolPosition'])
</script>

