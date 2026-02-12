<template>
  <div class="app">
    <!-- <header>
    </header> -->
    <aside>
      <div class="header">
        <h2>Drug stock forecaster</h2>
      </div>
      <DrugsCalculatorForm />
    </aside>
    <main>
      <div class="header header-content" v-if="store.showForecast">
        <h2>Your forecast</h2>
        <div class="share-button-container">
          <p class="small-text">Share this forecast with others using the webpage link</p>
          <button class="share-button" :class="{ 'copied': isCopied }" @click="shareForecast">
            <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              aria-hidden="true">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            <Transition name="fade" mode="out-in">
              <span v-if="!isCopied">{{ shareButtonText }}</span>
              <span v-else>Copied</span>
            </Transition>
          </button>
        </div>
      </div>
      <div class="content" v-if="store.showForecast">
        <TheForecast />
        <Assumptions />
        <Calculation />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import DrugsCalculatorForm from './components/DrugsCalculatorForm.vue'
import Calculation from './components/Calculation.vue'
import TheForecast from './components/TheForecast.vue'
import Assumptions from './components/Assumptions.vue'
import { useDrugCalcStore } from './stores/drugsCalculator'

const store = useDrugCalcStore()

const shareForecast = () => {
  const url = window.location.href
  navigator.clipboard.writeText(url)
  setIsCopieTimeout()
}

const isCopied = ref(false)
const shareButtonText = computed(() => {
  return isCopied.value ? 'Copied' : 'Copy link'
})

function setIsCopieTimeout() {
  isCopied.value = true
  setTimeout(() => {
    isCopied.value = false
  }, 3000)
}
</script>

<style>
@import './style.css';

body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.87);
  /* background-color: #f5f5f5; */
}

.app {
  min-height: 100dvh;
  width: 100vw;
  display: grid;
  grid-template-columns: 300px 1fr;
}

h1 {
  font-size: 2em;
  line-height: 1.1;
}

h2 {
  font-size: 1.1em;
  line-height: 1.1;

}

h3 {
  font-size: 1em;
  line-height: 1.1;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  font-weight: 600;
  color: #999;
  margin: 2rem 0 1rem;
}

h3:not(:first-child) {
  margin-top: 4rem;
}

aside {
  width: 100%;
  /* background-color: #f5f5f5; */
  border-right: 1px solid #dedede;
  display: grid;
  grid-template-rows: 66px 1fr;
}

.header {
  height: 66px;
  display: flex;
  /* border-bottom: 1px solid #dedede; */
  align-items: center;
  padding: 0 1.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content {
  padding: 0 var(--main-content-padding-y);
}

.content {
  padding: 0 var(--main-content-padding-y) 4rem;
}

.share-button-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.share-button {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem 0.2rem 0.5rem 0.7rem;
  background-color: #eee;
  color: black;
  border: none;
  border-radius: 6px;
  border: 1px solid #ddd;
  width: 106px;
  transition: background-color 0.3s;

  span {
    width:60px;
    text-align: center;
  }
}

.copy-icon {
  flex-shrink: 0;
}

.share-button:hover {
  background-color: #eee;
  border: 1px solid #ddd;
}

.share-button:active {
  transform: scale(0.98);
}

/* .share-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.1);
} */

.share-button.copied {
  background-color: #92e6c0;
  color: #054729;
  border: 1px solid #69cfa1;
}

.small-text {
  font-size: 0.8rem;
  color: #777;
  font-weight: 400;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
