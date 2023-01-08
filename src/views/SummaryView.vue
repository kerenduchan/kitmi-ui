<script setup>
import { ref, computed } from 'vue'

// components
import ButtonWithTooltip from '@/components/ButtonWithTooltip.vue'
import SummaryTable from '../components/SummaryTable.vue'
import Filter from '@/components/charts/Filter.vue'

// composables
import { formatDate, formatMonthAndYear } from '@/composables/utils'
import getSummary from '@/composables/queries/getSummary'

// Did the data arrive from the server
const isReady = ref(false)

const summary = ref(null)

// filter params
const filterParams = ref({
    startDate: "2022-01-01",
    endDate: "2022-12-31",
    groupBy: 'category',
    isExpense: true,
})

// params for "getSummary" for the stacked bar chart
function getSummaryParams() {
    return {
        startDate: filterParams.value.startDate,
        endDate: filterParams.value.endDate,
        options: {
            isExpense: filterParams.value.isExpense,
            groupBy: filterParams.value.groupBy,
            bucketBy: 'month',
            mergeUnderThreshold: false
        }
    }
}

const title = computed(() => {
    const f = filterParams.value
    return (f.isExpense ? "Expenses" : "Income") 
        + ' by ' + f.groupBy
        + ' for ' + formatDate(new Date(f.startDate)) + ' - ' 
        + formatDate(new Date(f.endDate))
})

// show filter dialog
const showFilterDialog = ref(false)

const { onResult, refetch } = getSummary(getSummaryParams())

onResult(queryResult => {
    if (queryResult && queryResult.data) {
        const s = queryResult.data.summary
        summary.value = {
            buckets: s.buckets.map(b => formatMonthAndYear(b)),
            groups: s.groups,
            totals: s.totals
        }
        isReady.value = true
        showFilterDialog.value = false   
    }
})

function handleFilter(filter) {
    filterParams.value = filter
    isReady.value = false
    refetch(getSummaryParams())
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
        :summary="summary"
    />

    <!-- Filter dialog -->
        <v-dialog v-model="showFilterDialog">
        <Filter
            :defaults="filterParams"
            @close="showFilterDialog = false"
            @filter="handleFilter" />
    </v-dialog>

</template>
