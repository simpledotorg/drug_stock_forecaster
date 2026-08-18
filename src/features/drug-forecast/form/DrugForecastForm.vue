<template>
  <div class="form-container">
    <h2 class="print-form-title show-on-print new-page">Data entered to generate forecast</h2> <!-- Title on printout only -->
    <form @submit.prevent class="form">
      <ProgramDataFields :forecast-months="forecastMonths" :patients-under-care="patientsUnderCare"
        :target-enrolment="targetEnrolment" :treatment-adherence="treatmentAdherence"
        @update:patientsUnderCare="patientsUnderCare = $event" @update:targetEnrolment="targetEnrolment = $event"
        @update:treatmentAdherence="treatmentAdherence = $event" />

      <ProtocolSelect :protocols="protocols" :active-protocol-id="activeProtocolId"
        @update:activeProtocolId="store.setActiveProtocolId($event)" />

      <IncludeStatinsToggle :include-statins="includeStatins" :protocol-has-statin="protocolHasStatin"
        @update:includeStatins="includeStatins = $event" />

      <DrugCostList :drugs="catalogDrugsForActiveProtocol" />

      <CurrencyField :currency-symbol="currencySymbol" :currency-symbol-position="currencySymbolPosition"
        @update:currencySymbol="currencySymbol = $event"
        @update:currencySymbolPosition="currencySymbolPosition = $event" />
    </form>
    <ProtocolAssumptionOverrides />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useDrugCalcStore } from '../../../stores/drugsCalculator'
import { useDrugCalcQuerySync } from '../../../composables/useDrugCalcQuerySync'
import ProgramDataFields from './components/ProgramDataFields.vue'
import ProtocolSelect from './components/ProtocolSelect.vue'
import ProtocolAssumptionOverrides from './components/ProtocolAssumptionOverrides.vue'
import DrugCostList from './components/DrugCostList.vue'
import IncludeStatinsToggle from './components/IncludeStatinsToggle.vue'
import CurrencyField from './components/CurrencyField.vue'

const store = useDrugCalcStore()
useDrugCalcQuerySync(store)

const {
  forecastMonths,
  patientsUnderCare,
  targetEnrolment,
  treatmentAdherence,
  catalogDrugsForActiveProtocol,
  protocols,
  activeProtocolId,
  includeStatins,
  protocolHasStatin,
  currencySymbol,
  currencySymbolPosition,
} = storeToRefs(store)
</script>

<style>
.form-group-title {
  font-size: 0.85rem;
  font-weight: 1000;
  color: #444;
  margin-top: 0.4rem;
  margin-bottom: -0.2rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.form-group-title--spaced {
  margin-top: 1.3rem;
}

.form-container {
  width: 100%;
  min-width: 0;
  max-width: 220px;
}

@media print {
  .form-container {
    max-width: none;
    width: 100%;
    padding-top: 0;
  }

  .print-form-title {
    margin: 1.5rem 0 0.75rem;
    font-size: 1.25rem;
    line-height: 1.15;
    font-weight: 800;
    letter-spacing: 0.01em;
    color: #000;
    font-family: var(--font-display);
  }

  .form-group-title {
    grid-column: span 3;
    margin: 0.25rem 0 0.05rem;
    color: #000;
    font-weight: 750;
    letter-spacing: 0.08em;
  }

  .new-page {
    break-before: page;
    padding-top: 0;
  }

  .form {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.9rem 1.25rem;
    align-items: start;
  }

  .segmented-control {
    max-width: none;
    border: 1px solid rgba(0, 0, 0, 0.35);
    background: transparent;
  }

  .segmented-control__btn {
    padding: 0.35rem 0.5rem;
    font-size: 0.78rem;
    color: #000;
  }

  .segmented-control__btn.is-selected {
    border: 1px solid rgba(0, 0, 0, 0.08);
  }

  .tooltip-trigger,
  .tooltip-bubble {
    display: none !important;
  }
}

.form {
  display: grid;
  gap: 0.75rem;
  width: 100%;

  @media print {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.small-text {
  font-size: 0.8rem;
  color: #666;
}

.segmented-control {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  max-width: 200px;
  border: 1px solid color-mix(in oklab, var(--ink) 14%, transparent);
  border-radius: 12px;
  background: color-mix(in oklab, var(--paper) 94%, var(--bg1));
  overflow: visible;
}

/* Two real buttons so Tab visits Before and After separately (native radio = one tab stop per group). */
.segmented-control__btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 0;
  min-width: 0;
  margin: 0;
  padding: 0.25rem 0.6rem;
  border: none;
  background: transparent;
  font: inherit;
  font-weight: 600;
  font-size: 0.8rem;
  color: color-mix(in oklab, var(--ink) 88%, var(--muted));
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.segmented-control__btn:focus {
  outline: none;
}

.segmented-control__btn:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: -2px;
  z-index: 1;
}

.segmented-control__btn--left {
  border-top-left-radius: 11px;
  border-bottom-left-radius: 11px;
}

.segmented-control__btn--right {
  border-top-right-radius: 11px;
  border-bottom-right-radius: 11px;
}

.segmented-control__btn.is-selected {
  border: 2px solid color-mix(in oklab, var(--accent2) 60%, var(--paper));
  color: var(--ink);
  margin: -1px;
}

.currency-group {
  display: grid;
  grid-template-columns: 3fr 9fr;
  gap: 0.5rem;
}

.currency-group>.input {
  min-width: 0;
  width: 100%;
}

.optional {
  font-size: 0.7rem;
  color: #666;
  font-weight: 400;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  margin-left: 0.3rem;
}
</style>
