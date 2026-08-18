<template>
  <h4 class="form-group-title form-group-title--spaced">Cost per tablet</h4>
  <FormField v-for="drug in drugs" :key="drug.id" :input-id="'cost-' + drug.id" :label="drug.name">
    <input
      :id="'cost-' + drug.id"
      :value="costFieldValue(drug.costPerTablet)"
      required
      type="number"
      step="any"
      min="0"
      class="input"
      placeholder="Cost per tablet"
      @input="drug.costPerTablet = $event.target.valueAsNumber"
    />
  </FormField>
</template>

<script setup>
import FormField from './FormField.vue'

defineProps({
  drugs: { type: Array, required: true },
})

function costFieldValue(v) {
  return typeof v === 'number' && Number.isFinite(v) ? v : ''
}
</script>