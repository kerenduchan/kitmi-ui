<script setup>
import YearlySummaryTable from '@/components/YearlySummaryTable.vue'
import getYearlySummary from '@/composables/queries/getYearlySummary'

const {
    summary,
    isReady,
    refetch
} = getYearlySummary(2020)

</script>

<template>
    <div class="top-bar">
    </div>
    <v-divider />

    <div v-if="!isReady">Loading...</div>
    <div v-else>

        <h2>Year {{ summary.year }}</h2>

        <h3>Income</h3>
        <YearlySummaryTable 
            :rows="summary.incomeRows" 
        />

        <h3>Expenses</h3>
        <YearlySummaryTable 
            :rows="summary.expenseRows" 
        />

</div>
</template>
