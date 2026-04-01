<template>
  <div class="form-container">
    <form @submit.prevent class="form">
      <ProgramDataFields
        :forecast-months="forecastMonths"
        :patients-under-care="patientsUnderCare"
        :target-enrolment="targetEnrolment"
        :treatment-adherence="treatmentAdherence"
        @update:patientsUnderCare="patientsUnderCare = $event"
        @update:targetEnrolment="targetEnrolment = $event"
        @update:treatmentAdherence="treatmentAdherence = $event"
      />

      <ProtocolSelect
        :protocols="protocols"
        :active-protocol-id="activeProtocolId"
        @update:activeProtocolId="activeProtocolId = $event"
      />

      <DrugCostList :drugs="catalogDrugsForActiveProtocol" />

      <CurrencyField
        :currency-symbol="currencySymbol"
        :currency-symbol-position="currencySymbolPosition"
        @update:currencySymbol="currencySymbol = $event"
        @update:currencySymbolPosition="currencySymbolPosition = $event"
      />
    </form>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useDrugCalcStore } from '../../../stores/drugsCalculator'
import { useDrugCalcQuerySync } from '../../../composables/useDrugCalcQuerySync'
import ProgramDataFields from './components/ProgramDataFields.vue'
import ProtocolSelect from './components/ProtocolSelect.vue'
import DrugCostList from './components/DrugCostList.vue'
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
  currencySymbol,
  currencySymbolPosition,
} = storeToRefs(store)
</script>

<style>
.form-container {
  width: 100%;
  min-width: 0;
}

@media print {
  h4 {
    grid-column: span 3;
  }

  .new-page {
    break-before: page;
    padding-top: 2rem;
  }
}

.form {
  display: grid;
  gap: 0.85rem;
  width: 100%;

  @media print {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-group-title {
  font-size: 0.8rem;
  font-weight: 800;
  color: #444;
  margin-top: 0.4rem;
  margin-bottom: -0.3rem;
  text-transform: uppercase;
}

label {
  font-weight: 600;
  color: #333;
  font-size: 0.85rem;
}

.input {
  padding: 0.7rem 0.7rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #fff;
  font-size: 0.9rem;
  transition: border-color 0.3s;
}

.input-select {
  padding-left: 0.4rem;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding-right: 2rem;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='black'><path d='M5 7l5 5 5-5'/></svg>");
  background-repeat: no-repeat;
  background-position: right 0.7rem center;
  background-size: 1rem;
}

.input:disabled {
  background-color: #eee;
  color: #444;
  border: 1px solid #ccc;
  cursor: not-allowed;
}

.input:focus {
  outline: none;
  border-color: #42b883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.1);
}

.input::placeholder {
  color: #999;
  font-size: 0.9rem;
}

.small-text {
  font-size: 0.8rem;
  color: #666;
}

.tooltip-trigger {
  position: relative;
  display: inline-block;
  width: fit-content;
  cursor: help;
  align-self: flex-start;
}

.tooltip-trigger-text {
  display: inline-block;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  text-decoration-color: #ccc;
}

.tooltip-bubble {
  position: absolute;
  bottom: calc(100% + 0.3rem);
  left: 50%;
  transform: translateX(-50%);
  padding: 0.5rem 0.75rem;
  max-width: 240px;
  width: 100%;
  font-size: 0.8rem;
  line-height: 1.35;
  background: #2d2d2d;
  color: #f0f0f0;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  white-space: normal;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.tooltip-bubble::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -6px;
  border: 6px solid transparent;
  border-top-color: #2d2d2d;
}

.tooltip-trigger:hover .tooltip-bubble,
.tooltip-trigger.tooltip-open .tooltip-bubble {
  opacity: 1;
  visibility: visible;
}

.segmented-control {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  max-width: 200px;
  border: 1px solid #b3d0b4;
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
}

.segmented-control__option {
  position: relative;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.segmented-control__option input[type='radio'] {
  position: absolute;
  inset: 0;
  opacity: 0;
  margin: 0;
  cursor: pointer;
}

.segmented-control__option span {
  flex: 1 1 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.65rem 0.6rem;
  font-weight: 600;
  font-size: 0.8rem;
  color: #333;
  background: transparent;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.segmented-control__option--left span {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

.segmented-control__option--right span {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

.segmented-control__option input[type='radio']:checked + span {
  background: #2bbc5b;
  color: #fff;
}

.segmented-control__option input[type='radio']:focus-visible + span {
  outline: 2px solid rgba(66, 184, 131, 0.55);
  outline-offset: -2px;
}

.currency-group {
  display: grid;
  grid-template-columns: 3fr 9fr;
  gap: 0.5rem;
}

.currency-group > .input {
  min-width: 0;
  width: 100%;
}
</style>

