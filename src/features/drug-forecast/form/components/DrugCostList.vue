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

<style scoped>
h4 {
  padding-top: 1.3rem;
  margin-top: 0.7rem;
  border-top: 1px solid #ddd;
  color: #888;
  font-weight: 500;
  font-size: 0.90rem;
  letter-spacing: 0.06em;
  margin-bottom: 0.2rem;
}

@media print {
  h4 {
    border-top: none;
    padding-top: 0;
    margin-top: 0.9rem;
    color: #000;
    font-weight: 650;
    margin-bottom: 0.05rem;
  }
}
</style>
