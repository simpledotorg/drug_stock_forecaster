<template>
  <div class="form-group">
    <label for="activeProtocolId">Treatment protocol</label>
    <select
      id="activeProtocolId"
      class="input input-select"
      :value="activeProtocolId"
      @change="$emit('update:activeProtocolId', $event.target.value)"
    >
      <option v-for="p in protocols" :key="p.id" :value="p.id">{{ p.name }}</option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  activeProtocolId: { type: String, required: true },
  protocols: { type: Array, required: true },
})

defineEmits(['update:activeProtocolId'])
</script>

