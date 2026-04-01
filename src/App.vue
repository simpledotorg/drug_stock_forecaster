<template>

  <div class="wrapper">
    <header class="header-container">
      <h1>Drug stock forecast calculator</h1>
      <ForecastControls />
    </header>
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
            <ForecastPeriodControl />
          </div>
          <TheForecast />
          <!-- <Assumptions /> -->
          <Calculation />
        </div>
      </main>
    </div>
    <footer class="hide-on-print">
      <p class="small-text"><strong>Disclaimer:</Strong> By using this tool you acknowldge the figures calculated are
        machine generated and represent estimated figures, not accurate recommendations. RTSL cannot be held responsible
        for any errors or omissions in the figures or for outcomes that occur as a result of the using this tool.</p>
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
import DrugsCalculatorForm from './components/DrugsCalculatorForm.vue'
import Calculation from './components/Calculation.vue'
import TheForecast from './components/TheForecast.vue'
import ForecastControls from './features/drug-forecast/components/ForecastControls.vue'
import ForecastPeriodControl from './features/drug-forecast/components/ForecastPeriodControl.vue'
// import Assumptions from './components/Assumptions.vue'
import { useDrugCalcStore } from './stores/drugsCalculator'

const store = useDrugCalcStore()
</script>

<style>
@import './style.css';

a {
  color: color-mix(in oklab, var(--accent) 88%, var(--ink));
}

.wrapper {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding: var(--space-4);
  gap: var(--space-3);
}

.app {
  display: grid;
  grid-template-columns: 272px 1fr;
  gap: var(--space-5);
  flex: 1;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
    gap: var(--space-4);
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
    padding: var(--space-3);
  }

  .app aside .aside-content {
    padding: var(--space-3);
  }

  .content {
    padding: var(--space-4);
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
  padding: var(--space-3) 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* border-bottom: 1px solid #ebebeb; */
}

@media (max-width: 600px) {
  header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}

h1 {
  font-size: 1.25rem;
  line-height: 1.1;
  font-family: var(--font-display);
}

h2 {
  font-family: var(--font-display);
  font-size: 1.9rem;
  line-height: 1.1;
  /* margin-bottom: 0.5rem; */
  letter-spacing: -0.02em;
  margin: 0.4rem 0
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
  gap: var(--space-3);
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
    padding: var(--space-6);
    width: 100%;
    background-color: var(--paper);
    border: 1px solid var(--faint);
    box-shadow: var(--shadow-1);
    border-radius: var(--radius-lg);
  }
}

.content {
  position: relative;
  overflow: clip;
}

.content::before {
  content: none;
}

.app aside .aside-content {
  background: color-mix(in oklab, var(--paper) 92%, var(--bg1));
  border: 1px solid var(--faint);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-2);
  padding: var(--space-4);
}

.app main .content {
  min-width: 0;
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
  gap: var(--space-2);
}

.share-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  gap: 0.35rem;
  height: 36px;
  padding: 0 1rem 0 0.65rem;
  background: white;
  color: var(--ink);
  border: 1px solid var(--faint);
  border-radius: 999px;
  width: auto;
  transition: transform 0.12s ease, background-color 0.12s ease, border-color 0.12s ease;
  font-size: 0.8rem;
  font-weight: 600;
  box-shadow: var(--shadow-2);

  span {
    width: auto;
    text-align: center;
  }
}

/* Stable width when label swaps “Copy link” ↔ “Copied” */
.share-button--copy {
  min-width: 7.75rem;
}

.share-button:hover {
  background: color-mix(in oklab, var(--paper) 86%, var(--bg1));
  border-color: color-mix(in oklab, var(--accent) 28%, var(--faint));
}

.share-button:active {
  transform: translateY(1px);
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
  background: color-mix(in oklab, var(--accent2) 18%, var(--paper));
  color: color-mix(in oklab, var(--accent2) 35%, var(--ink));
  border-color: color-mix(in oklab, var(--accent2) 50%, var(--faint));
}

.small-text {
  font-size: 0.8rem;
  color: var(--muted);
  font-weight: 400;
}

.text-right {
  text-align: right;
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
  padding: var(--space-1) 0 var(--space-4);
  border-top: 1px solid var(--faint);
}

.created-by {
  width: 100%;
  text-align: center;

  @media print {
    display: none;
  }
}

@media print {
  .wrapper {
    max-width: none;
    padding: 0;
    gap: 0;
  }

  .app aside .aside-content {
    padding: 0;
    border: none;
    box-shadow: none;
    background: transparent;
    border-radius: 0;
  }

  .content {
    padding: 0;
    border: none;
    box-shadow: none;
    border-radius: 0;
  }
}
</style>
