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
        placeholder="1000"
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
      placeholder="1200"
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

input {
  background-color: transparent;
}

/* :deep(.form-group:has(.input:not(:disabled):not(.input--optional):placeholder-shown:focus)),
:deep(.form-group:has(.input:not(:disabled):not(.input--optional):invalid:focus)) {
  box-shadow:
    0 0 0 2px var(--focus-ring),
    0 0 0 5px var(--focus-ring-glow),
    0 0 0 1px color-mix(in oklab, #e11d48 40%, transparent),
    0 10px 18px rgba(15, 23, 42, 0.08);
  background-color: var(--paper, #fff);
} */
</style>