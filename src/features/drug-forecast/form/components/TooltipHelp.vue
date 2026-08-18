<template>
  <p
    ref="rootRef"
    class="small-text tooltip-trigger"
    :class="{ 'tooltip-open': open }"
    @click.stop="open = !open"
  >
    <span class="smaller-text tooltip-trigger-text hide-on-print">{{ triggerText }}</span>
    <span class="tooltip-bubble hide-on-print">
      <span class="tooltip-bubble-arrow"></span>
      <span class="tooltip-bubble-content">
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

<style scoped>
.smaller-text {
  font-size: 0.7rem;
}

.tooltip-trigger {
  position: relative;
  display: inline-block;
  width: 100%;
  cursor: help;
  align-self: flex-start;
  margin: 0 !important;
}

.tooltip-trigger-text {
  display: inline-block;
  margin-left: 0.6rem;
  text-decoration: underline;
  text-decoration-style: dashed;
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;
  text-decoration-color: #555;
  anchor-name: --tooltip-trigger-text;
}

.tooltip-bubble {
  position: absolute;
  top: 98%;
  left: 50%;
  transform: translateX(-50%);
  max-width: 240px;
  width: 100%;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
  z-index: 10;
  display: flex;
  flex-direction: column;
  position-anchor: --tooltip-trigger-text;
}

.tooltip-bubble-content {
  position: relative;
  z-index: 1;
  padding: 0.5rem 0.75rem;

  background: #2d2d2d;
  color: #f0f0f0;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  white-space: normal;
  font-size: 0.8rem;
  line-height: 1.35;
}

.tooltip-trigger:hover .tooltip-bubble {
  opacity: 1;
  visibility: visible;
  transition: opacity 0.1s ease-out 0.15s, visibility 0s linear 0.15s;
}
.tooltip-trigger.tooltip-open .tooltip-bubble {
  opacity: 1;
  visibility: visible;
  transition: opacity 0.1s ease-out, visibility 0s;
}

.tooltip-bubble-arrow {
  position: relative;
  top: 100%;
  left: 32%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-bottom-color: #2d2d2d;
  width: 6px;
}
</style>