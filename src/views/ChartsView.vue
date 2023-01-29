<script setup>
import { ref, computed } from 'vue'

// components
import ActionsBar from '@/components/ActionsBar.vue'
import Actions from '@/components/Actions.vue'
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

const subtitle = computed(() => {
    const f = filterParams.value
    return (f.isExpense ? "Expenses" : "Income") + ' by ' + f.groupBy + ' for ' +
    formatDate(new Date(f.startDate)) + ' - ' + formatDate(new Date(f.endDate))
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
    <!-- actions bar at the top -->
    <ActionsBar>

        <!-- actions at the start of the actions bar -->
        <Actions>
            <!-- Filter button -->
            <div>
                <ButtonWithTooltip tooltip="Filter" icon="mdi-filter" @click="showFilterDialog = true" />
            </div>

        </Actions>
        
    </ActionsBar>

    <!-- content -->
    <div id="content">
        <div id="content-title">
            Charts
        </div>
        <div id="content-main" class="scrollable">
            <v-container fluid class="pa-0">
                <v-row dense>
                    <v-col>
                        <v-card variant="outlined">
                            <v-card-text>
                                <!-- the stacked bar chart -->
                                <StackedBarChart v-if="summaryForStackedBarChart"
                                    :xaxis="summaryForStackedBarChart.buckets"
                                    :series="summaryForStackedBarChart.groups"
                                    :yaxisFormatterFunc="formatRoundNumber"
                                />
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-card variant="outlined">
                            <v-card-text class="d-flex justify-center">
                                <PieChart v-if="summaryForPieChart"
                                    :series="pieChartSeries"
                                    :labels="pieChartLabels"                                    
                                />
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </div>
    </div>

    <!-- Filter dialog -->
    <v-dialog v-model="showFilterDialog" width="800">
    <Filter
        :defaults="filterParams"
        @close="showFilterDialog = false"
        @filter="handleFilter" />
    </v-dialog>

</template>
