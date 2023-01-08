<script setup>
import { ref, computed } from 'vue'

// components
import ButtonWithTooltip from '@/components/ButtonWithTooltip.vue'
import SummaryTable from '../components/SummaryTable.vue'
import Filter from '@/components/Filter.vue'

// composables
import { formatDate } from '@/composables/utils'
import getSummary from '@/composables/queries/getSummary'

const incomeSummary = ref(null)
const expensesSummary = ref(null)

// filter params
const filterParams = ref({
    startDate: "2022-01-01",
    endDate: "2022-12-31",
    groupBy: 'category',
    isExpense: null,
})

// params for "getSummary" for the expenses table
function getExpensesSummaryParams() {
    return {
        startDate: filterParams.value.startDate,
        endDate: filterParams.value.endDate,
        options: {
            isExpense: true,
            groupBy: filterParams.value.groupBy,
            bucketBy: 'month',
            mergeUnderThreshold: false
        }
    }
}

// params for "getSummary" for the income table
function getIncomeSummaryParams() {
    const params = getExpensesSummaryParams()
    params.options.isExpense = false
    return params
}

const title = computed(() => {
    const f = filterParams.value
    return formatDate(new Date(f.startDate)) + ' - ' 
        + formatDate(new Date(f.endDate))
})

// show filter dialog
const showFilterDialog = ref(false)

const { 
    onResult: onExpensesResult, 
    refetch: refetchExpenses } = 
    getSummary(getExpensesSummaryParams())

const { 
    onResult: onIncomeResult, 
    refetch: refetchIncome } = 
    getSummary(getIncomeSummaryParams())

onIncomeResult(queryResult => {
    if (queryResult && queryResult.data) {
        incomeSummary.value = queryResult.data.summary
        showFilterDialog.value = false   
    }
})

onExpensesResult(queryResult => {
    if (queryResult && queryResult.data) {
        expensesSummary.value = queryResult.data.summary
        showFilterDialog.value = false   
    }
})

function handleFilter(filter) {
    filterParams.value = filter
    incomeSummary.value = null
    expensesSummary.value = null
    refetchIncome(getIncomeSummaryParams())
    refetchExpenses(getExpensesSummaryParams())
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
    </div>
    <v-divider />

    <h3 class="text-center">{{ title }}</h3>
    <h4 class="text-center">by {{ filterParams.groupBy }}</h4>
    <v-container fluid>
        <v-row dense>
            <v-col>
                <v-card>
                    <v-card-title>
                        Income
                    </v-card-title>
                    <v-card-text>
                        <SummaryTable v-if="incomeSummary" :summary="incomeSummary" />
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-card>
                    <v-card-title>
                        Expenses
                    </v-card-title>
                    <v-card-text>
                        <SummaryTable v-if="expensesSummary" :summary="expensesSummary" />
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>

    <!-- Filter dialog -->
    <v-dialog v-model="showFilterDialog">
        <Filter :defaults="filterParams" @close="showFilterDialog = false" @filter="handleFilter" />
    </v-dialog>

</template>
