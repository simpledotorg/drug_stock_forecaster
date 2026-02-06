<template>
  <div class="app">
    <!-- <header>
    </header> -->
    <aside>
      <div class="header">
        <h2>Drug stock forecaster</h2>
      </div>
      <DrugsCalculatorForm />
    </aside>
    <main>
      <div class="header header-content">
        <h2>Your forecast</h2>
        <button class="share-button">share forecast</button>
      </div>
      <div class="content">
        <TheForecast />
        <Assumptions />
        <Calculation />
      </div>
    </main>
  </div>
</template>

<script setup>
import DrugsCalculatorForm from './components/DrugsCalculatorForm.vue'
import Calculation from './components/Calculation.vue'
import TheForecast from './components/TheForecast.vue'
import Assumptions from './components/Assumptions.vue'
</script>

<style>
@import './style.css';

body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.87);
  /* background-color: #f5f5f5; */
}

.app {
  min-height: 100dvh;
  width: 100vw;
  display: grid;
  grid-template-columns: 300px 1fr;
}

h1 {
  font-size: 2em;
  line-height: 1.1;
}

h2 {
  font-size: 1.1em;
  line-height: 1.1;
  
}

h3 {
  font-size: 1em;
  line-height: 1.1;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  font-weight: 600;
  color: #999;
  margin: 2rem 0 1rem;
}
h3:not(:first-child) {
  margin-top: 4rem;
}

aside {
  width: 100%;
  /* background-color: #f5f5f5; */
  border-right: 1px solid #dedede;
  display: grid;
  grid-template-rows: 66px 1fr;
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

.header-content {
  padding: 0 var(--main-content-padding-y);
}

.content {
  padding: 0 var(--main-content-padding-y) 4rem;
}

.share-button {
  padding: 0.5rem 1rem;
  background-color: #ddd;
  color: black;
  border: none;
  border-radius: 4px;
}

.share-button:hover {
  background-color: #ededed;
}

.share-button:active {
  transform: scale(0.98);
}

.share-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.1);
}
</style>
