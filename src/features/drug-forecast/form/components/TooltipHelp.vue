<template>
  <p
    ref="rootRef"
    class="small-text tooltip-trigger"
    :class="{ 'tooltip-open': open }"
    @mouseenter="open = true"
    @mouseleave="open = false"
    @click.stop="open = !open"
  >
    <span class="small-text tooltip-trigger-text hide-on-print">{{ triggerText }}</span>
    <span class="tooltip-bubble hide-on-print">
      <span>
        <slot />
      </span>
    </span>
  </p>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({
  triggerText: { type: String, default: 'What does this mean?' },
})

const rootRef = ref(null)
const open = ref(false)

function onDocClick(e) {
  const el = rootRef.value
  if (!el) return
  if (!el.contains(e.target)) open.value = false
}

onMounted(() => document.addEventListener('click', onDocClick))
onUnmounted(() => document.removeEventListener('click', onDocClick))
</script>

