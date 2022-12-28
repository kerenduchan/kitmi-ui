<script setup>
import { ref, computed } from 'vue'

// components
import { formatDate } from '@/composables/utils'
import ButtonWithTooltip from '@/components/ButtonWithTooltip.vue'
import StackedBarChart from '@/components/charts/StackedBarChart.vue'
import Filter from '@/components/charts/Filter.vue'

// composables
import getSummary from '@/composables/queries/getSummary'

// Labels for the x-axis
const xaxis = ref(null)

// Did the data arrive from the server
const isReady = ref(false)

// The stacked data (y-axis values) for the bar chart
const series = ref(null)

// filter params
const filterParams = ref({
    startDate: "2022-01-01",
    endDate: "2022-12-31",
    groupBy: 'category',
    isExpense: true
})

const title = computed(() => {
    const f = filterParams.value
    return (f.isExpense ? "Expenses" : "Income") 
        + ' by ' + f.groupBy
        + ' for ' + formatDate(new Date(f.startDate)) + ' - ' 
        + formatDate(new Date(f.endDate))
})

// show filter dialog
const showFilterDialog = ref(false)

const { onResult, refetch } = getSummary(filterParams.value)

onResult(queryResult => {
    if (queryResult && queryResult.data) {
        const summary = queryResult.data.summary
        xaxis.value = summary.xAxis
        series.value = summary.groups
        isReady.value = true
        showFilterDialog.value = false   
    }
})

function handleFilter(filter) {
    filterParams.value = filter
    isReady.value = false
    refetch(filter)
}

</script>

<template>
    <div class="top-bar">

        <div class="top-bar-left">

            <!-- Filter button -->
            <div class="top-bar-action">
                <ButtonWithTooltip tooltip="Filter" icon="mdi-filter" @click="showFilterDialog = true" />
            </div>

        </div>
        <v-divider />
    </div>

    {{ title }}
    <!-- the stacked bar chart -->
    <StackedBarChart 
        v-if="isReady" 
        :xaxis="xaxis" 
        :series="series" 
    />

    <!-- Filter dialog -->
        <v-dialog v-model="showFilterDialog">
        <Filter
            :defaults="filterParams"
            @close="showFilterDialog = false"
            @filter="handleFilter" />
    </v-dialog>

</template>
