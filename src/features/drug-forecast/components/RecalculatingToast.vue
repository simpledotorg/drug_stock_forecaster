<template>
  <Teleport to="body">
    <div class="recalc-toast-slot hide-on-print">
      <Transition name="recalc-toast">
        <div
          v-if="isRecalculating"
          class="recalc-toast"
          role="status"
          aria-live="polite"
        >
          <span class="recalc-toast__spinner" aria-hidden="true"></span>
          Recalculating
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useDrugCalcStore } from '../../../stores/drugsCalculator'

const { isRecalculating } = storeToRefs(useDrugCalcStore())
</script>

<style scoped>
.recalc-toast-slot {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  z-index: 40;
  transform: translateX(-50%);
  pointer-events: none;
}

.recalc-toast {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.5rem 0.95rem;
  border-radius: 999px;
  background: #2d2d2d;
  color: #f0f0f0;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.22);
  white-space: nowrap;
}

.recalc-toast__spinner {
  width: 0.85rem;
  height: 0.85rem;
  flex-shrink: 0;
  border: 2px solid rgba(240, 240, 240, 0.28);
  border-top-color: #f0f0f0;
  border-radius: 50%;
  animation: recalc-spin 0.7s linear infinite;
}

.recalc-toast-enter-active,
.recalc-toast-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.recalc-toast-enter-from,
.recalc-toast-leave-to {
  opacity: 0;
  transform: translateY(0.4rem);
}

@keyframes recalc-spin {
  to {
    transform: rotate(360deg);
  }
}

@media print {
  .recalc-toast-slot {
    display: none;
  }
}
</style>
