<script setup>
import { ref, computed } from 'vue'

// components
import ButtonWithTooltip from '@/components/ButtonWithTooltip.vue'
import StackedBarChart from '@/components/StackedBarChart.vue'
import PieChart from '@/components/PieChart.vue'
import Filter from '@/components/Filter.vue'

// composables
import { formatDate, formatNumber, formatMonthAndYear } from '@/composables/utils'
import getSummary from '@/composables/queries/getSummary'

// the data from "getSummary" for the stacked bar chart
const summaryForStackedBarChart = ref(null)

// the data from "getSummary" for the pie chart
const summaryForPieChart = ref(null)

// filter params
const filterParams = ref({
    startDate: "2022-01-01",
    endDate: "2022-12-31",
    groupBy: 'category',
    isExpense: true,
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

// params for "getSummary" for the stacked bar chart
function getStackedBarChartParams() {
    return {
        startDate: filterParams.value.startDate,
        endDate: filterParams.value.endDate,
        options: {
            isExpense: filterParams.value.isExpense,
            groupBy: filterParams.value.groupBy,
            bucketBy: 'month',
            mergeUnderThreshold: true
        }
    }
}

// params for "getSummary" for the pie chart
function getPieChartParams() {
    // the same as the stacked bar chart params, but bucket by range
    const params = getStackedBarChartParams()
    params.options.bucketBy = 'range'
    return params
}

// get the summary for the stacked bar chart
const {
    onResult: onStackedBarChartResult,
    refetch: refetchStackedBarChart 
} = getSummary(getStackedBarChartParams())

// get the summary for the pie chart
const {
    onResult: onPieChartResult,
    refetch: refetchPieChart 
} = getSummary(getPieChartParams())


onStackedBarChartResult(queryResult => {
    if (queryResult && queryResult.data) {
        const s = queryResult.data.summary
        summaryForStackedBarChart.value = {
            buckets: s.buckets.map(b => formatMonthAndYear(b)),
            groups: s.groups
        }
        showFilterDialog.value = false   
    }
})

onPieChartResult(queryResult => {
    if (queryResult && queryResult.data) {
        const s = queryResult.data.summary
        summaryForPieChart.value = {
            buckets: s.buckets.map(b => formatMonthAndYear(b)),
            groups: s.groups
        }
        showFilterDialog.value = false   
    }
})

function handleFilter(filter) {
    filterParams.value = filter
    summaryForStackedBarChart.value = null
    summaryForPieChart.value = null
    refetchStackedBarChart(getStackedBarChartParams())
    refetchPieChart(getPieChartParams())
}

function formatRoundNumber(n) {
    return formatNumber(n, 0)
}

const pieChartSeries = computed(() => {
    return summaryForPieChart.value.groups.map(g => g.total)
})

const pieChartLabels = computed(() => {
    return summaryForPieChart.value.groups.map(g => g.name)
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
        <!-- the stacked bar chart -->
        <StackedBarChart v-if="summaryForStackedBarChart"
            :xaxis="summaryForStackedBarChart.buckets"
            :series="summaryForStackedBarChart.groups"
            :yaxisFormatterFunc="formatRoundNumber"
        />

        <PieChart v-if="summaryForPieChart"
            :series="pieChartSeries"
            :labels="pieChartLabels"
        />

    <!-- Filter dialog -->
        <v-dialog v-model="showFilterDialog">
        <Filter
            :defaults="filterParams"
            @close="showFilterDialog = false"
            @filter="handleFilter" />
    </v-dialog>

</template>
