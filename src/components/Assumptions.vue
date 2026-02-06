<template>
    <h3>Assumptions</h3>
    <div>
        <table>
            <thead>
                <th>Total population</th>

            </thead>
            <tbody>
                <tr>
                    <td>Total population</td>
                    <td>{{ store.totalPopulation }}</td>
                </tr>
                <tr>
                    <td>Adult population</td>
                    <td>80%</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { useDrugCalcStore } from '../stores/drugsCalculator'

const store = useDrugCalcStore()
</script>