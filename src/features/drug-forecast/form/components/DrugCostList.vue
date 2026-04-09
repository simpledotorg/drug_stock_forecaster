<template>
  <h4 class="form-group-title">Cost per tablet</h4>
  <div v-for="drug in drugs" :key="drug.id" class="form-group">
    <label :for="'cost-' + drug.id">{{ drug.name }}</label>
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
  </div>
</template>

<script setup>
defineProps({
  drugs: { type: Array, required: true },
})

function costFieldValue(v) {
  return typeof v === 'number' && Number.isFinite(v) ? v : ''
}
</script>

