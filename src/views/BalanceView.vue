<script setup>
import { ref, computed } from 'vue'

// components
import ActionsBar from '@/components/layout/ActionsBar.vue'
import Actions from '@/components/layout/Actions.vue'
import ViewContent from '@/components/layout/ViewContent.vue'
import ViewContentTitle from '@/components/layout/ViewContentTitle.vue'
import ViewContentMain from '@/components/layout/ViewContentMain.vue'

import ButtonWithTooltip from '@/components/ButtonWithTooltip.vue'
import SummaryTable from '../components/balance/SummaryTable.vue'
import SavingsTable from '../components/balance/SavingsTable.vue'
import Filter from '@/components/Filter.vue'

// composables
import { formatDate } from '@/composables/utils'
import getBalanceSummary from '@/composables/queries/getBalanceSummary'

const balanceSummary = ref(null)

// filter params
const filterParams = ref({
    startDate: "2022-01-01",
    endDate: "2022-12-31",
    groupBy: 'category'
})

const subtitle = computed(() => {
    const f = filterParams.value
    return 'By ' + filterParams.value.groupBy + ' for ' + 
    formatDate(new Date(f.startDate)) + ' - ' + formatDate(new Date(f.endDate))
})

// show filter dialog
const showFilterDialog = ref(false)

const { onResult, refetch } = getBalanceSummary(filterParams.value)

onResult(queryResult => {
    if (queryResult && queryResult.data) {
        balanceSummary.value = queryResult.data.balanceSummary
        showFilterDialog.value = false   
    }
})

function handleFilter(filter) {
    filterParams.value = filter
    balanceSummary.value = null
    refetch(filterParams.value)
}

</script>

<template>
    <!-- actions bar at the top -->
    <ActionsBar>

        <!-- actions at the start of the actions bar -->
        <Actions>
            <!-- Filter button -->
            <ButtonWithTooltip tooltip="Filter" icon="mdi-filter" @click="showFilterDialog = true" />
        </Actions>

    </ActionsBar>

    <!-- content, below the actions bar -->
    <ViewContent>

        <!-- content title -->
        <ViewContentTitle text="Balance" />

        <ViewContentMain>
            <div class="ps-3"></div>
            <div class="text-h6 pt-0 pb-3">Income</div>
            <SummaryTable v-if="balanceSummary" :summary="balanceSummary.income" />

            <div class="text-h6 pt-5 pb-3">Expenses</div>
            <SummaryTable v-if="balanceSummary" :summary="balanceSummary.expenses" />

            <div class="text-h6 pt-5 pb-3">Savings</div>
            <SavingsTable v-if="balanceSummary" :balanceSummary="balanceSummary" />
        </ViewContentMain>
        
    </ViewContent>

    <!-- Filter dialog -->
    <v-dialog v-model="showFilterDialog" width="800">
        <Filter :defaults="filterParams" @close="showFilterDialog = false" @filter="handleFilter" />
    </v-dialog>

</template>
