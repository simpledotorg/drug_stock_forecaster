<template>
  <div class="share-button-container hide-on-print">
    <p class="forecast-controls__intro">Share <span class="hide-on-mobile">this forecast</span> with others using the webpage link</p>
    <button
      class="share-button share-button--copy"
      :class="{ copied: isCopied }"
      type="button"
      @click="copyLink"
    >
      <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      <Transition name="fade" mode="out-in">
        <span>{{ shareButtonText }}</span>
        <!-- <span v-else>Copied</span> -->
      </Transition>
    </button>
    <!-- <button v-if="canNativeShare" class="share-button" type="button" @click="shareForecastNative">
      <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
        <line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
      </svg>
      <span>Share</span>
    </button> -->
    <button class="share-button hide-on-mobile" type="button" @click="printForecast">
      <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
      </svg>
      <span>Print report</span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const isCopied = ref(false)
const copyResetTimer = ref(null)

const shareButtonText = computed(() => (isCopied.value ? 'Link copied' : 'Share report'))

const canNativeShare = computed(() => {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function'
})

function setIsCopiedTimeout() {
  if (copyResetTimer.value !== null) clearTimeout(copyResetTimer.value)
  isCopied.value = true
  copyResetTimer.value = setTimeout(() => {
    isCopied.value = false
    copyResetTimer.value = null
  }, 2500)
}

function copyLink() {
  const url = window.location.href
  navigator.clipboard.writeText(url)
  setIsCopiedTimeout()
}

// async function shareForecastNative() {
//   const url = window.location.href
//   try {
//     await navigator.share({
//       title: 'Drug stock forecast',
//       text: 'Drug stock forecast',
//       url,
//     })
//   } catch {
//     navigator.clipboard.writeText(url)
//     setIsCopiedTimeout()
//   }
// }

function printForecast() {
  window.print()
}
</script>

<style scoped>
.forecast-controls__intro {
  font-size: 0.8rem;
  color: var(--muted);
  font-weight: 400;
  margin: 0;
}

.share-button-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.share-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  gap: 0.5rem;
  height: 36px;
  padding: 0 1rem 0 0.75rem;
  background: white;
  color: var(--ink);
  border: 1px solid transparent;
  border-radius: 10px;
  width: auto;
  transition: transform 0.12s ease, background-color 0.12s ease, border-color 0.12s ease;
  font-size: 0.8rem;
  font-weight: 600;
  box-shadow: var(--shadow-2);
}

.share-button span {
  width: auto;
  text-align: center;
}

.share-button--copy {
  min-width: 8.3rem;
}

.share-button:hover {
  background: color-mix(in oklab, var(--paper) 86%, var(--bg1));
  border-color: color-mix(in oklab, var(--accent) 28%, var(--faint));
}

.share-button:active {
  transform: translateY(1px);
}

.share-button:focus {
  outline: none;
}

.share-button:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}

.copy-icon {
  flex-shrink: 0;
  width: 14px;
  margin-left: 4px;
}

.share-button.copied {
  background: color-mix(in oklab, var(--accent2) 18%, var(--paper));
  color: color-mix(in oklab, var(--accent2) 35%, var(--ink));
  border-color: color-mix(in oklab, var(--accent2) 50%, var(--faint));
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 900px) {
  .share-button-container {
    flex-wrap: wrap;
    justify-content: flex-start;
  }
}
</style>
