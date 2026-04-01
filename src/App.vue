<template>

  <div class="wrapper">
    <header></header>
    <div class="share-button-container print-hide">
      <p class="small-text">Share this forecast with others using the webpage link</p>
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
      <button class="share-button" :class="{ 'copied': isCopied }" @click="shareForecast">
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
    <div class="app">
      <aside>
        <div class="aside-content">
          <!-- <div>
              <p class="small-text">
                Enter data to get a drug forecast for {{ store.monthsToForecast }} months.
              </p>
            </div> -->
          <DrugsCalculatorForm />
        </div>
      </aside>
      <main>
        <div class="content">
          <div class="content-header">
            <h2>Drug stock forecast</h2>
            <div class="period-input-container">
              <!-- <div class="period-button-group">
                <button class="button" @click="store.forecastMonths += 1"><svg xmlns="http://www.w3.org/2000/svg"
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                </button>
                <button class="button" @click="store.forecastMonths -= 1"><svg xmlns="http://www.w3.org/2000/svg"
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
              </div> -->
              <!-- <div class="period"> -->
              <div class="period-button-input-group hide-on-print">
                <button class="button" @click="store.forecastMonths += 1">
                  <svg xmlns="http://www.w3.org/2000/svg"
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                    stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                </button>
                <input type="number" v-model="store.forecastMonths" class="period-input" placeholder="12" min="1" />
                <button class="button" @click="store.forecastMonths -= 1"><svg xmlns="http://www.w3.org/2000/svg"
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                    stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
              </div>
              <p><span class="show-on-print">{{ store.forecastMonths }}</span> month forecast</p>
            </div>
          </div>
          <TheForecast />
          <!-- <Assumptions /> -->
          <Calculation />
        </div>
      </main>
    </div>
    <footer class="hide-on-print">
      <p class="small-text created-by">
        Created by <a href="https://resolvetosavelives.org" target="_blank">Resolve to Save Lives</a>
      </p>
      <!-- <p class="small-text">
          Source: <a href="https://www.who.int/news-room/fact-sheets/detail/hypertension" target="_blank">WHO Fact
            Sheet on Hypertension</a>
        </p> -->
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import DrugsCalculatorForm from './components/DrugsCalculatorForm.vue'
import Calculation from './components/Calculation.vue'
import TheForecast from './components/TheForecast.vue'
// import Assumptions from './components/Assumptions.vue'
import { useDrugCalcStore } from './stores/drugsCalculator'

const store = useDrugCalcStore()

const shareForecast = () => {
  const url = window.location.href
  navigator.clipboard.writeText(url)
  setIsCopieTimeout()
}

const canNativeShare = computed(() => {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function'
})

const shareForecastNative = async () => {
  const url = window.location.href
  try {
    await navigator.share({
      title: 'Drug stock forecast',
      text: 'Drug stock forecast',
      url,
    })
  } catch (e) {
    // user cancelled, or share failed → fallback to copy
    navigator.clipboard.writeText(url)
    setIsCopieTimeout()
  }
}

const printForecast = () => {
  window.print()
}

const isCopied = ref(false)
const copyResetTimer = ref(null)
const shareButtonText = computed(() => {
  return isCopied.value ? 'Copied' : 'Copy link'
})

function setIsCopieTimeout() {
  if (copyResetTimer.value !== null) {
    clearTimeout(copyResetTimer.value)
  }
  isCopied.value = true
  copyResetTimer.value = setTimeout(() => {
    isCopied.value = false
    copyResetTimer.value = null
  }, 2500)
}
</script>

<style>
@import './style.css';

a {
  color: #0f56e4;
}

body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.87);

}


.wrapper {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  width: 100vw;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.app {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 2rem;
  flex: 1;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  @media print {
    grid-template-columns: 1fr;

    aside {
      order: 1;
    }
  }
}

@media (max-width: 900px) {
  .wrapper {
    padding: 0 1rem;
  }

  .content {
    padding: 1.25rem;
  }

  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .share-button-container {
    flex-wrap: wrap;
    justify-content: flex-start;
  }
}

header {
  /* background-color: #eaf5ff; */
  padding: 1rem 1.75rem;
  /* border-bottom: 1px solid #ebebeb; */
}

h1 {
  font-size: 1.25rem;
  line-height: 1.1;
}

h2 {
  font-size: 1.5em;
  line-height: 1.1;
  /* margin-bottom: 0.5rem; */
}

h3 {
  font-size: 0.9em;
  line-height: 1.1;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 600;
  color: #999;
  margin: 2rem 0 1rem;
}

h3:not(:first-child) {
  margin-top: 4rem;
}

.aside-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  /* padding: 0.5rem 1rem 1rem; */
  /* background-color: #eee; */
  /* border: 1px solid #ddd; */
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


@media not print {
  .content {
    padding: 3rem;
    width: 100%;
    background-color: #fff;
    border-top: 1px solid #ddd;
    border-right: 1px solid #ddd;
    border-left: 1px solid #ddd;
    border-bottom: 1px solid #ccc;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04);
    border-radius: 2px;
  }
}


.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.share-button-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 0.75rem 0;
}

.share-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.1rem;
  height: 32px;
  background-color: #eee;
  color: black;
  border: none;
  border-radius: 6px;
  border: 1px solid #ddd;
  width: 90px;
  transition: background-color 0.3s;
  font-size: 0.75rem;

  span {
    width: 60px;
    text-align: center;
  }
}

.share-button:hover {
  background-color: #e3e3e3;
  border: 1px solid #ddd;
}

.share-button:active {
  transform: scale(0.98);
}

.copy-icon {
  flex-shrink: 0;
  width: 14px;
  margin-left: 4px;
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

.text-right {
  text-align: right;
}

.forecast-period-text {
  color: #777;
  font-weight: 400;
  margin-left: 0.6rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.print-hide {
  @media print {
    display: none;
  }
}

footer {
  margin-top: 40px;
  padding: 0.8rem 0 1rem;
  border-top: 1px solid #ddd;
}

.period-button-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  .button {
    /* background-color: #e4eaff;
    border: 1px solid #c0c7fe; */

    background-color: #fff;
    border: 1px solid #e0dfdf;
    border-radius: 6px;
    text-align: center;
    display: inline-block;
    height: 20px;
    width: 40px;

    @media print {
      display: none;
    }

    svg {
      width: 14px;
      height: 100%;
    }
  }
}

.period-input {
  -moz-appearance: textfield;
  appearance: textfield;
  border: 1px solid #e0dfdf;
  border-radius: 6px;
  font-size: 0.8rem;
  text-align: center;
  display: inline-block;
  width: 40px;
  height: 30px;
  font-size: 1rem;

  @media print {
    width: auto;
    border: none;
  }
}

.period-input::-webkit-outer-spin-button,
.period-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.period-input-container {
  display: grid;
  grid-template-columns: 32px 1fr;
  align-items: center;
  gap: 0.75rem;
  @media print {
    grid-template-columns: 1fr;
  }
}

.created-by {
  width: 100%;
  text-align: center;

  @media print {
    display: none;
  }
}
</style>
