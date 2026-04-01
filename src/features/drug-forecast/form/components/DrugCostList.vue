<template>
  <h4 class="form-group-title">Cost per tablet</h4>
  <div v-for="drug in drugs" :key="drug.id" class="form-group">
    <label :for="'cost-' + drug.id">{{ drug.name }}</label>
    <input
      :id="'cost-' + drug.id"
      v-model.number="drug.costPerTablet"
      type="number"
      step="any"
      class="input"
      placeholder="Cost per tablet"
    />
  </div>
</template>

<script setup>
defineProps({
  drugs: { type: Array, required: true },
})
</script>

