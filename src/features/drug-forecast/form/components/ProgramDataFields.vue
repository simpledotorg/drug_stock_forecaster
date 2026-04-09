<template>
  <h4 class="form-group-title new-page">Program data</h4>

  <div class="form-group">
    <label for="patientsUnderCare">Patients under care</label>
    <input
      id="patientsUnderCare"
      :value="numericOrEmpty(patientsUnderCare)"
      required
      @input="$emit('update:patientsUnderCare', $event.target.valueAsNumber)"
      type="number"
      step="any"
      min="0"
      class="input"
      placeholder="200000"
    />
    <TooltipHelp trigger-text="What does this mean?">
      The total number of patients enrolled in the hypertension program that visited in the past 12 months.
    </TooltipHelp>
  </div>

  <div class="form-group">
    <label for="targetEnrolment">Target enrolment over {{ forecastMonths }} months</label>
    <input
      id="targetEnrolment"
      :value="numericOrEmpty(targetEnrolment)"
      required
      @input="$emit('update:targetEnrolment', $event.target.valueAsNumber)"
      type="number"
      step="any"
      min="0"
      class="input"
      placeholder="10000"
    />
  </div>

  <div class="form-group">
    <label for="treatmentAdherence">% Treatment adherence</label>
    <input
      id="treatmentAdherence"
      :value="numericOrEmpty(treatmentAdherence)"
      required
      @input="$emit('update:treatmentAdherence', $event.target.valueAsNumber)"
      type="number"
      step="any"
      class="input"
      placeholder="65"
      maxlength="3"
      min="0"
      max="100"
    />
    <TooltipHelp trigger-text="How do I calculate this?">
      <span>This number is the percentage of patients that attended for treatment in past 3 months.</span>
      <span><b>Numerator:</b> Patients that attended for treatment in past 3 months.</span>
      <span><b>Denominator:</b> Total patients enrolled.</span>
    </TooltipHelp>
  </div>
</template>

<script setup>
import TooltipHelp from './TooltipHelp.vue'

function numericOrEmpty(v) {
  return typeof v === 'number' && Number.isFinite(v) ? v : ''
}

defineProps({
  forecastMonths: { type: Number, required: true },
  patientsUnderCare: { type: Number, required: true },
  targetEnrolment: { type: Number, required: true },
  treatmentAdherence: { type: Number, required: true },
})

defineEmits([
  'update:patientsUnderCare',
  'update:targetEnrolment',
  'update:treatmentAdherence',
])
</script>

<style scoped>
h4 {
  margin-top: 4rem;
  color: #888;
  font-weight: 500;
  font-size: 0.90rem;
  letter-spacing: 0.06em;
  margin-bottom: 0.2rem;
}

</style>
