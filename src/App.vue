<template>

  <div class="wrapper">
    <!-- <header class="header-container">
      <h1 class="hide-on-print">Drug requirement forecast calculator</h1>
    </header> -->
    <div class="app">
      <aside>
        <div class="aside-content">
          <DrugsCalculatorForm />
        </div>
      </aside>
      <main>
        <ForecastControls />
        <div class="content">
          <div class="content-padding">

            <div class="content-header">
              <h1>Drug requirement forecast</h1>
              <ForecastPeriodControl v-model="forecastMonths" />
            </div>
            <TheForecast />
            <!--<ProtocolStepCostTable />-->
            <!-- <Assumptions /> -->
          </div>
          <div :class="{ 'print-hide': !includeBreakdownInPrint }">
            <CollapsibleSection
              title="Calculation breakdown"
              :default-open="false"
              show-print-include
              v-model:include-in-print="includeBreakdownInPrint"
            >
              <CalculationBreakdown />
            </CollapsibleSection>
          </div>
          <div :class="{ 'print-hide': !includeProtocolAssumptionsInPrint }">
            <ProtocolAssumptions v-model:include-in-print="includeProtocolAssumptionsInPrint" />
          </div>
        </div>
        <p class="small-text disclaimer">
          <strong>Disclaimer:</strong>
          Reports are machine-generated
          approximations only—they are not medical advice, prescribing guidance, or guaranteed procurement figures.
          Resolve
          to Save Lives (RTSL) makes no warranty as to accuracy or completeness and is not liable for errors, omissions,
          or any actions taken based on results from this report.
        </p>
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
import { ref } from 'vue'
import DrugsCalculatorForm from './components/DrugsCalculatorForm.vue'
import CalculationBreakdown from './components/CalculationBreakdown.vue'
import TheForecast from './components/TheForecast.vue'
import ForecastControls from './features/drug-forecast/components/ForecastControls.vue'
import ForecastPeriodControl from './features/drug-forecast/components/ForecastPeriodControl.vue'
import CollapsibleSection from './components/CollapsibleSection.vue'
import ProtocolAssumptions from './features/drug-forecast/components/ProtocolAssumptions.vue'
import ProtocolStepCostTable from './features/drug-forecast/components/ProtocolStepCostTable.vue'
// import Assumptions from './components/Assumptions.vue'
import { storeToRefs } from 'pinia'
import { useDrugCalcStore } from './stores/drugsCalculator'

const { forecastMonths } = storeToRefs(useDrugCalcStore())

/** When false, the drug breakdown block is omitted from printed output. */
const includeBreakdownInPrint = ref(false)

/** When false, protocol assumptions are omitted from printed output. */
const includeProtocolAssumptionsInPrint = ref(false)
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
  margin: 40px auto 0;
  padding: var(--space-4);
  gap: var(--space-3);
}

.app {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) 4fr;
  gap: var(--space-5);
  flex: 1;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  @media print {
    grid-template-columns: 1fr;

    aside {
      order: 2;
      break-before: page;
    }

    main {
      order: 1;
    }
  }
}

@media (max-width: 900px) {
  .wrapper {
    padding: var(--space-3);
  }

  .app aside .aside-content {
    padding: 0;
  }

  .content {
    padding: var(--space-4);
  }

  .content-header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .content-header h2 {
    width: 100%;
    max-width: 100%;
    margin-left: 0;
    margin-right: 0;
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
  font-size: 2.25rem;
  line-height: 1.1;
  font-family: var(--font-display);
}

h2 {
  font-family: var(--font-display);
  font-size: 1.5rem;
  line-height: 1.1;
  /* margin-bottom: 0.5rem; */
  /* letter-spacing: -0.02em; */
  margin: 0;
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
    width: 100%;
    background-color: var(--paper);
    /* border: 1px solid #00000015; */
    box-shadow: var(--shadow-1);
    border-radius: var(--radius-xs);
  }

  .content-padding {
    padding: var(--space-7) var(--space-7);
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
  padding: 0;
  min-width: 0;
}

.app main .content {
  min-width: 0;
}


.content-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
}

.content-header h2 {
  text-align: left;
}

.small-text {
  font-size: 0.8rem;
  color: var(--muted);
  font-weight: 400;
}

.text-right {
  text-align: right;
}

.disclaimer {
  margin: 1.25rem 1rem;
  /* padding: 0 0.5rem; */
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
  h1 {
    font-size: 1.9rem;
    line-height: 1.12;
  }

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
