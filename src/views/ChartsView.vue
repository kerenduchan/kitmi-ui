<script setup>
import { ref, computed } from 'vue'

// components
import ButtonWithTooltip from '@/components/ButtonWithTooltip.vue'
import StackedBarChart from '@/components/charts/StackedBarChart.vue'
import PieChart from '@/components/charts/PieChart.vue'
import Filter from '@/components/charts/Filter.vue'

// composables
import { formatDate, formatNumber, formatMonthAndYear } from '@/composables/utils'
import getSummary from '@/composables/queries/getSummary'

const summary = ref(null)

// Did the data arrive from the server
const isReady = ref(false)

// filter params
const filterParams = ref({
    startDate: "2022-01-01",
    endDate: "2022-12-31",
    groupBy: 'category',
    isExpense: true,
    bucketSize: 'range',
    mergeUnderThreshold: true
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
        const s = queryResult.data.summary
        summary.value = {
            buckets: s.buckets.map(b => formatMonthAndYear(b)),
            groups: s.groups
        }
        isReady.value = true
        showFilterDialog.value = false   
    }
})

function handleFilter(filter) {
    filterParams.value = filter
    isReady.value = false
    refetch(filter)
}

function formatRoundNumber(n) {
    return formatNumber(n, 0)
}

const pieChartSeries = computed(() => {
    return summary.value.groups.map(g => g.total)
})

const pieChartLabels = computed(() => {
    return summary.value.groups.map(g => g.name)
})

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
    <div v-if="isReady" >
        <!-- the stacked bar chart -->
        <StackedBarChart
            :xaxis="summary.buckets"
            :series="summary.groups"
            :yaxisFormatterFunc="formatRoundNumber"
        />

        <PieChart 
            :series="pieChartSeries"
            :labels="pieChartLabels"
        />
    </div>

    <!-- Filter dialog -->
        <v-dialog v-model="showFilterDialog">
        <Filter
            :defaults="filterParams"
            @close="showFilterDialog = false"
            @filter="handleFilter" />
    </v-dialog>

</template>
