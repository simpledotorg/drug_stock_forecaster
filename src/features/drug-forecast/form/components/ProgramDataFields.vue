<template>
  <h4 class="form-group-title title-margin-alt">Program data</h4>

  <div>
    <FormField input-id="patientsUnderCare" label="Patients under care">
      <input
        id="patientsUnderCare"
        :value="numericOrEmpty(patientsUnderCare)"
        required
        type="number"
        step="any"
        min="0"
        class="input"
        placeholder="200000"
        @input="$emit('update:patientsUnderCare', $event.target.valueAsNumber)"
      />
    </FormField>
    <TooltipHelp trigger-text="What does this mean?">
      The total number of patients enrolled in the hypertension program that visited in the past 12 months.
    </TooltipHelp>
  </div>

  <FormField input-id="targetEnrolment" :label="`Target enrolment over ${forecastMonths} months`">
    <input
      id="targetEnrolment"
      :value="numericOrEmpty(targetEnrolment)"
      required
      type="number"
      step="any"
      min="0"
      class="input"
      placeholder="10000"
      @input="$emit('update:targetEnrolment', $event.target.valueAsNumber)"
    />
  </FormField>

  <div>
    <FormField input-id="treatmentAdherence" label="% Treatment adherence">
      <input
        id="treatmentAdherence"
        :value="numericOrEmpty(treatmentAdherence)"
        required
        type="number"
        step="any"
        class="input"
        placeholder="65"
        maxlength="3"
        min="0"
        max="100"
        @input="$emit('update:treatmentAdherence', $event.target.valueAsNumber)"
      />
    </FormField>
    <TooltipHelp trigger-text="How do I calculate this?">
      <span>This number is the percentage of patients that attended for treatment in past 3 months.</span>
      <span><b>Numerator:</b> Patients that attended for treatment in past 3 months.</span>
      <span><b>Denominator:</b> Total patients enrolled.</span>
    </TooltipHelp>
  </div>
</template>

<script setup>
import FormField from './FormField.vue'
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
.title-margin-alt {
  margin-top: 3.5rem;
}
</style>