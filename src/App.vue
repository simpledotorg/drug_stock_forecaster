<script setup>
import DrugsCalculatorForm from './components/DrugsCalculatorForm.vue'
import Forecast from './components/Forecast.vue'
</script>

<template>
  <div class="app">
    <aside>
      <DrugsCalculatorForm />
    </aside>
    <main>
      <Forecast />
    </main>
  </div>
</template>

<style>
.app {
  display: grid;
  grid-template-columns: 300px 1fr;
  min-height: 100dvh;
  width: 100vw;
  background-color: #f5f5f5;
}

/* aside {} */
</style>
