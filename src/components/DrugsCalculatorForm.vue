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
      <div class="form-group">
        <label for="totalPopulation">Total Population</label>
        <input
          id="totalPopulation"
          v-model.number="totalPopulation"
          type="number"
          step="any"
          class="input"
          placeholder="Enter total population"
        />
      </div>

      <div class="form-group">
        <label for="adultPopulation">% Adult Population</label>
        <input
          id="adultPopulation"
          v-model.number="adultPopulation"
          type="number"
          step="any"
          class="input"
          placeholder="% of total poplation are adults"
        />
      </div>

      <div class="form-group">
        <label for="prevalenceHTN">% Prevalence of HTN in adults</label>
        <input
          id="prevalenceHTN"
          v-model.number="prevalenceHTN"
          type="number"
          step="any"
          class="input"
          placeholder="Enter prevalence of HTN in adults"
        />
      </div>

      <!-- <div class="form-group">
        <label for="prevalenceHTN">Estimated HTN population</label>
        <input
          id="estimatedHTNPopulation"
          v-model.number="store.estimatedHTNPopulation"
          type="number"
          step="any"
          class="input"
          placeholder="Enter prevalence of HTN in adults"
          readonly
          disabled="true"
        />
      </div> -->



      <div class="form-group">
        <label for="existingPatients">Existing regular patients</label>
        <input
          id="existingPatients"
          v-model.number="existingPatients"
          type="number"
          step="any"
          class="input"
          placeholder="Enter existing regular patients"
        />
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
        <label for="targetEnrolment">Yearly new enrolment target</label>
        <input
          id="targetEnrolment"
          v-model.number="targetEnrolment"
          type="number"
          step="any"
          class="input"
          placeholder="# patients to enrol"
        />
      </div>



      <div class="form-group">
        <label for="treatmentAdherence">% Expected treatment adherence</label>
        <input
          id="treatmentAdherence"
          v-model.number="treatmentAdherence"
          type="number"
          step="any"
          class="input"
          placeholder="Enter expected treatment adherence"
        />
      </div>

      <!-- drugs -->
      <div class="form-group">
        <label for="amoldipine5mgCost">Amoldipine 5mg Cost</label>
        <input
          id="amoldipine5mgCost"
          v-model.number="amoldipine5mgCost"
          type="number"
          step="any"
          class="input"
          placeholder="Cost per tablet"
        />
      </div>

      <div class="form-group">
        <label for="losartan50mgCost">Losartan 50mg Cost</label>
        <input
          id="losartan50mgCost"
          v-model.number="losartan50mgCost"
          type="number"
          step="any"
          class="input"
          placeholder="Cost per tablet"
        />
      </div>

      <div class="form-group">
        <label for="hydrochlorothiazide25mgCost">Hydrochlorothiazide 25mg Cost</label>
        <input
          id="hydrochlorothiazide25mgCost"
          v-model.number="hydrochlorothiazide25mgCost"
          type="number"
          step="any"
          class="input"
          placeholder="Cost per tablet"
        />
      </div>

      <button type="submit" class="submit-button">Calculate</button>
    </form>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDrugCalcStore } from '../stores/drugsCalculator'
// import { useDrugCalcQuerySync } from '../composables/useDrugCalcQuerySync.ts'

const store = useDrugCalcStore()
// useDrugCalcQuerySync(store)

const {
  totalPopulation,
  adultPopulation,
  prevalenceHTN,
  existingPatients,
  targetEnrolment,
  treatmentAdherence,
  amoldipine5mgCost,
  losartan50mgCost,
  hydrochlorothiazide25mgCost,
} = storeToRefs(store)

const handleSubmit = () => {
  console.log('Form submitted:', value)
  // Add your calculation logic here
}
</script>

<style scoped>
.form-container {
  width: 100%;
  overflow-y: scroll;
  height: calc(100dvh - 66px);
  padding: 1.5rem 1.75rem;
}

h2 {
  margin-bottom: 1rem;
  color: #333;
}

.form {
  display: grid;
  /* grid-template-columns: repeat(4, 1fr); */
  gap: 0.85rem;
  width: 100%;
  /* grid-auto-flow: row; */
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

label {
  font-weight: 500;
  color: #444;
  font-size: 0.85rem;
}

.input {
  padding: 0.7rem 0.8rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #fff;
  font-size: 1rem;
  transition: border-color 0.3s;
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
</style>

