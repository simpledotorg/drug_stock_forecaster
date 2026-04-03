<template>
  <div class="form-group hide-on-print">
    <label for="currencySymbol">Currency symbol</label>
    <div class="currency-group">
      <input
        id="currencySymbol"
        :value="currencySymbol"
        @input="$emit('update:currencySymbol', $event.target.value)"
        type="text"
        class="input"
        placeholder="$"
      />
      <div class="segmented-control" role="radiogroup" aria-label="Currency symbol position">
        <label class="segmented-control__option segmented-control__option--left">
          <input
            type="radio"
            name="currencySymbolPosition"
            value="start"
            :checked="currencySymbolPosition === 'start'"
            @change="$emit('update:currencySymbolPosition', 'start')"
          />
          <span>Before</span>
        </label>
        <label class="segmented-control__option segmented-control__option--right">
          <input
            type="radio"
            name="currencySymbolPosition"
            value="end"
            :checked="currencySymbolPosition === 'end'"
            @change="$emit('update:currencySymbolPosition', 'end')"
          />
          <span>After</span>
        </label>
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

