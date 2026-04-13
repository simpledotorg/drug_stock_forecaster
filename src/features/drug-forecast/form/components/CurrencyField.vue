<template>
  <div class="form-group hide-on-print">
    <label for="currencySymbol">Currency symbol <span class="optional">OPTIONAL</span></label>
    <div class="currency-group">
      <input id="currencySymbol" :value="currencySymbol" @input="$emit('update:currencySymbol', $event.target.value)"
        type="text" class="input input--optional" placeholder="$" />
      <div class="segmented-control" role="group" aria-label="Currency symbol position">
        <button type="button" class="flex-col segmented-control__btn segmented-control__btn--left"
          :class="{ 'is-selected': currencySymbolPosition === 'start' }"
          :aria-pressed="currencySymbolPosition === 'start'" @click="$emit('update:currencySymbolPosition', 'start')">
          <span class="currency-symbol">{{ currencySymbol }} 10</span>
          <span class="small-text">Before</span>

        </button>
        <button type="button" class="flex-col segmented-control__btn segmented-control__btn--right"
          :class="{ 'is-selected': currencySymbolPosition === 'end' }" :aria-pressed="currencySymbolPosition === 'end'"
          @click="$emit('update:currencySymbolPosition', 'end')">
          <span class="currency-symbol">10 {{ currencySymbol }}</span>
          <span class="small-text">After</span>
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

<style scoped>

.small-text {
  font-size: 0.65rem;
  font-weight: 500;
  color: #666;
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
</style>