<template>
  <!-- <div style="position: fixed; top: 0; right: 0; width: 20%; height: 300px; z-index: 1000; overflow-y: scroll;">
    {{ store.estimatedMonthlyEnrolment }}
  {{ store.expectedCumulativeEnrolment }}
  {{ store.patientsTreatedFromAdherence }}
  {{ store.amoldipine5mgTablets }}
  {{ store.yearlyBreakdown }}

  </div> -->
  <div class="form-container">
    <form @submit.prevent="handleSubmit" class="form">



      <!-- <div class="form-group">
        <label for="totalPopulation">Total population</label>
        <input id="totalPopulation" v-model.number="totalPopulation" type="number" step="any" class="input"
          placeholder="1,000,000" />
      </div>

      <div class="form-group">
        <label for="adultPopulation">% Total population that are adults</label>
        <input id="adultPopulation" v-model.number="adultPopulation" type="number" step="any" class="input"
          placeholder="80" maxlength="3" min="0" max="100" />
        <p class="small-text">Usually ~80% are adults</p>
      </div>

      <div class="form-group">
        <label for="prevalenceHTN">% Prevalence of HTN in adults</label>
        <input id="prevalenceHTN" v-model.number="prevalenceHTN" type="number" step="any" class="input" placeholder="33"
          maxlength="3" min="0" max="100" />
        <p class="small-text">~33% world wide average</p>
      </div> -->
      <h4 class="form-group-title new-page">Program data</h4>
      <div class="form-group">
        <label for="patientsUnderCare">Patients under care</label>
        <input id="patientsUnderCare" v-model.number="patientsUnderCare" type="number" step="any" class="input"
          placeholder="200000" />
        <p ref="patientsUnderCareTooltipRef" class="small-text tooltip-trigger"
          :class="{ 'tooltip-open': showpatientsUnderCareTooltip }" @mouseenter="showpatientsUnderCareTooltip = true"
          @mouseleave="showpatientsUnderCareTooltip = false"
          @click.stop="showpatientsUnderCareTooltip = !showpatientsUnderCareTooltip">
          <span class="small-text tooltip-trigger-text hide-on-print">What does this mean?</span>
          <span class="tooltip-bubble hide-on-print">
            <span>
              The total number of patients enrolled in the hypertension program that visited in the past 12 months.
            </span>
          </span>
        </p>
      </div>

      <!-- <div class="form-group">
        <label for="currentCoverage">Current coverage</label>
        <input
          id="currentCoverage"
          v-model.number="store.htnCoverage"
          type="number"
          step="any"
          class="input"
          placeholder="Enter estimated HTN population"
          readonly
          disabled="true"
        />
      </div> -->

      <div class="form-group">
        <label for="targetEnrolment">Target enrolment over {{ forecastMonths }} months</label>
        <input id="targetEnrolment" v-model.number="targetEnrolment" type="number" step="any" class="input"
          placeholder="10000" />
      </div>



      <div class="form-group">
        <label for="treatmentAdherence">% Treatment adherence</label>
        <input id="treatmentAdherence" v-model.number="treatmentAdherence" type="number" step="any" class="input"
          placeholder="65" maxlength="3" min="0" max="100" />
        <p ref="adherenceTooltipRef" class="small-text tooltip-trigger"
          :class="{ 'tooltip-open': showAdherenceTooltip }" @mouseenter="showAdherenceTooltip = true"
          @mouseleave="showAdherenceTooltip = false" @click.stop="showAdherenceTooltip = !showAdherenceTooltip">
          <span class="small-text tooltip-trigger-text hide-on-print">How do I calculate this?</span>
          <span class="tooltip-bubble hide-on-print">
            <span>
              This number is the percentage of patients that attended for treatment in past 3 months.
            </span>
            <span>
              <b>Numerator:</b> Patients that attended for treatment in past 3 months.
            </span>
            <span>
              <b>Denominator:</b> Total patients enrolled.
            </span>
          </span>
        </p>
      </div>

      <div class="form-group">
        <label for="activeProtocolId">Treatment protocol</label>
        <select id="activeProtocolId" v-model="activeProtocolId" class="input input-select">
          <option v-for="p in protocols" :key="p.id" :value="p.id">{{ p.name }}</option> 
        </select>
      </div>

      <!-- <template v-if="activeOtherDrugs.length">
        <h4 class="form-group-title">Other medications (% of treated patients)</h4>
        <p class="small-text protocol-hint">Not part of the stacked treatment steps; optional add-on demand.</p>
        <div v-for="(row, idx) in activeOtherDrugs" :key="'other-' + idx" class="form-group">
          <label :for="'other-pct-' + idx">{{ row.label }}</label>
          <input :id="'other-pct-' + idx" v-model.number="row.percentage" type="number" step="any" min="0" max="100"
            class="input percentage" placeholder="%" />
        </div>
      </template> -->

      <h4 class="form-group-title">Cost per tablet</h4>
      <div v-for="drug in catalogDrugsForActiveProtocol" :key="drug.id" class="form-group">
        <label :for="'cost-' + drug.id">{{ drug.name }}</label>
        <input :id="'cost-' + drug.id" v-model.number="drug.costPerTablet" type="number" step="any" class="input"
          placeholder="Cost per tablet" />
      </div>
      <!-- <div class="form-group">
        <label for="forecastMonths">Months to forecast</label>
        <input id="forecastMonths" v-model.number="forecastMonths" type="number" step="any" class="input"
          placeholder="12" />
      </div> -->
      <div class="form-group hide-on-print">
        <label for="currencySymbol">Currency</label>
        <div class="currency-group">
          <input id="currencySymbol" v-model="currencySymbol" type="text" class="input" placeholder="$" />
          <!-- <div class="radio-group"> -->
          <label class="radio-option">
            <input type="radio" v-model="currencySymbolPosition" value="start" />
            <span>Before</span>
          </label>
          <label class="radio-option">
            <input type="radio" v-model="currencySymbolPosition" value="end" />
            <span>After</span>
          </label>
          <!-- </div> -->
        </div>
      </div>
      <!-- <button type="submit" class="submit-button">Calculate</button> -->
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDrugCalcStore } from '../stores/drugsCalculator'
import { useDrugCalcQuerySync } from '../composables/useDrugCalcQuerySync'

const store = useDrugCalcStore()
useDrugCalcQuerySync(store)

const adherenceTooltipRef = ref(null)
const showAdherenceTooltip = ref(false)
const patientsUnderCareTooltipRef = ref(null)
const showpatientsUnderCareTooltip = ref(false)

function closeAdherenceTooltipOnClickOutside(e) {
  if (adherenceTooltipRef.value && !adherenceTooltipRef.value.contains(e.target)) {
    showAdherenceTooltip.value = false
  }
  if (patientsUnderCareTooltipRef.value && !patientsUnderCareTooltipRef.value.contains(e.target)) {
    showpatientsUnderCareTooltip.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeAdherenceTooltipOnClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('click', closeAdherenceTooltipOnClickOutside)
})

const {
  forecastMonths,
  totalPopulation,
  adultPopulation,
  prevalenceHTN,
  patientsUnderCare,
  targetEnrolment,
  treatmentAdherence,
  catalogDrugsForActiveProtocol,
  protocols,
  activeProtocolId,
  activeProtocol,
  activeOtherDrugs,
  currencySymbol,
  currencySymbolPosition,
} = storeToRefs(store)

const handleSubmit = () => {
  console.log('Form submitted:', value)
  // Add your calculation logic here
}
</script>

<style scoped>
.form-container {
  width: 100%;
  min-width: 0;
}

h2 {
  margin-bottom: 1rem;
  color: #333;
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
  /* grid-template-columns: repeat(4, 1fr); */
  gap: 0.85rem;
  width: 100%;

  /* grid-auto-flow: row; */
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
  /* color: #444;
  */
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

.input.percentage {
  width: 62px;
  padding-right: 0.15rem;
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

.submit-button {
  padding: 0.75rem 2rem;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 0.5rem;
}

.submit-button:hover {
  background-color: #35a372;
}

.submit-button:active {
  transform: scale(0.98);
}

.small-text {
  font-size: 0.8rem;
  color: #666;
}

.protocol-hint {
  margin-top: -0.25rem;
  margin-bottom: 0.35rem;
  grid-column: 1 / -1;
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

/* .radio-group {
  display: flex;
  gap: 1rem;
} */

.radio-option {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  font-weight: 400;
  cursor: pointer;
}

.radio-option input[type="radio"] {
  accent-color: #42b883;
  margin: 0;
  cursor: pointer;
}

.currency-group {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5rem;
}

@media (hover: none) {
  .tooltip-trigger {
    -webkit-tap-highlight-color: transparent;
  }
}
</style>
