<template>
  <div class="share-button-container print-hide">
    <p class="small-text">Share this forecast with others using the webpage link</p>
    <button class="share-button" :class="{ copied: isCopied }" type="button" @click="copyLink">
      <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      <Transition name="fade" mode="out-in">
        <span v-if="!isCopied">{{ shareButtonText }}</span>
        <span v-else>Copied</span>
      </Transition>
    </button>
    <button v-if="canNativeShare" class="share-button" type="button" @click="shareForecastNative">
      <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
        <line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
      </svg>
      <span>Share</span>
    </button>
    <button class="share-button" type="button" @click="printForecast">
      <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
      </svg>
      <span>Print</span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const isCopied = ref(false)
const copyResetTimer = ref(null)

const shareButtonText = computed(() => (isCopied.value ? 'Copied' : 'Copy link'))

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

async function shareForecastNative() {
  const url = window.location.href
  try {
    await navigator.share({
      title: 'Drug stock forecast',
      text: 'Drug stock forecast',
      url,
    })
  } catch {
    navigator.clipboard.writeText(url)
    setIsCopiedTimeout()
  }
}

function printForecast() {
  window.print()
}
</script>
