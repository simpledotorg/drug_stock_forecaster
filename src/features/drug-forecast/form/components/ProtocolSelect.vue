<template>
  <div class="form-group">
    <label for="activeProtocolId">Treatment protocol</label>
    <select
      id="activeProtocolId"
      class="input input-select"
      :value="activeProtocolId"
      @change="$emit('update:activeProtocolId', $event.target.value)"
    >
      <template v-for="(section, index) in protocolSections" :key="sectionKey(section, index)">
        <optgroup v-if="section.type === 'group'" :label="section.label">
          <option v-for="p in section.protocols" :key="p.id" :value="p.id">{{ p.name }}</option>
        </optgroup>
        <option v-else :value="section.protocol.id">{{ section.protocol.name }}</option>
      </template>
    </select>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  activeProtocolId: { type: String, required: true },
  protocols: { type: Array, required: true },
})

defineEmits(['update:activeProtocolId'])

const protocolSections = computed(() => {
  const sections = []
  const groupIndex = new Map()

  for (const protocol of props.protocols) {
    if (!protocol.group) {
      sections.push({ type: 'option', protocol })
      continue
    }

    let index = groupIndex.get(protocol.group)
    if (index === undefined) {
      index = sections.length
      sections.push({ type: 'group', label: protocol.group, protocols: [] })
      groupIndex.set(protocol.group, index)
    }

    sections[index].protocols.push(protocol)
  }

  return sections
})

function sectionKey(section, index) {
  return section.type === 'group' ? `group-${section.label}` : `option-${section.protocol.id}-${index}`
}
</script>
