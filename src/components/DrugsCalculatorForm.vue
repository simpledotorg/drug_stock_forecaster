<template>
  <!-- <div style="position: fixed; top: 0; right: 0; width: 20%; height: 300px; z-index: 1000; overflow-y: scroll;">
    {{ store.estimatedMonthlyEnrolment }}
  {{ store.expectedCumulativeEnrolment }}
  {{ store.patientsTreatedFromAdherence }}
  {{ store.amoldipine5mgTablets }}
  {{ store.yearlyBreakdown }}

  </div> -->
  <div class="form-container">
    <h2>Drugs Calculator</h2>
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
        <label for="adultPopulation">Adult Population %</label>
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
        <label for="prevalenceHTN">Prevalence of HTN in adults</label>
        <input
          id="prevalenceHTN"
          v-model.number="prevalenceHTN"
          type="number"
          step="any"
          class="input"
          placeholder="Enter prevalence of HTN in adults"
        />
      </div>

      <div class="form-group">
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
      </div>



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

      <div class="form-group">
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
      </div>

      <div class="form-group">
        <label for="targetEnrolment">Target new enrolment for the year</label>
        <input
          id="targetEnrolment"
          v-model.number="targetEnrolment"
          type="number"
          step="any"
          class="input"
          placeholder="Enter target new enrolment for the year"
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

      <div class="form-group"></div>
        <label for="targetNewEnrollementInOneYear">Target new enrollement in one year</label>
        <input
          id="targetNewEnrollementInOneYear"
          v-model.number="store.targetNewEnrollementInOneYear"
          type="number"
          step="any"
          class="input"
          placeholder="Enter target new enrollement in one year"
          readonly
          disabled="true"
        />
      <!-- drugs -->
      <div class="form-group">
        <label for="amoldipine5mgCost">Amoldipine 5mg Cost</label>
        <input
          id="amoldipine5mgCost"
          v-model.number="amoldipine5mgCost"
          type="number"
          step="any"
          class="input"
          placeholder="Amoldipine 5mg cost per tablet"
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
          placeholder="Losartan 50mg cost per tablet"
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
          placeholder="Hydrochlorothiazide 25mg cost per tablet"
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
  max-width: 600px;
  margin: 0 auto;
  padding: 0.5rem;
}

h2 {
  margin-bottom: 1rem;
  color: #333;
  text-align: center;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 500;
  color: #555;
  font-size: 0.95rem;
}

.input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
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

