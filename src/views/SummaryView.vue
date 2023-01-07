<script setup>
import { ref, computed } from 'vue'

// components
import ButtonWithTooltip from '@/components/ButtonWithTooltip.vue'
import SummaryTable from '../components/SummaryTable.vue'
import Filter from '@/components/charts/Filter.vue'

// composables
import { formatDate, formatNumber, formatMonthAndYear } from '@/composables/utils'
import getSummary from '@/composables/queries/getSummary'

// Labels for the buckets (x-axis)
const buckets = ref(null)

// Did the data arrive from the server
const isReady = ref(false)

// The stacked data (y-axis values) for the bar chart
const groups = ref(null)

// filter params
const filterParams = ref({
    startDate: "2022-01-01",
    endDate: "2022-12-31",
    groupBy: 'category',
    isExpense: true,
    mergeUnderThreshold: false
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
        buckets.value = summary.buckets.map(b => formatMonthAndYear(b))
        groups.value = summary.groups
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

    <SummaryTable 
        v-if="isReady" 
        :buckets="buckets"
        :groups="groups"
    />

    <!-- Filter dialog -->
        <v-dialog v-model="showFilterDialog">
        <Filter
            :defaults="filterParams"
            @close="showFilterDialog = false"
            @filter="handleFilter" />
    </v-dialog>

</template>
