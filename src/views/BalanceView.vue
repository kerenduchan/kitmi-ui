<script setup>
import { ref, computed } from 'vue'

// components
import ButtonWithTooltip from '@/components/ButtonWithTooltip.vue'
import SummaryTable from '../components/SummaryTable.vue'
import SavingsTable from '../components/SavingsTable.vue'
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
    <div id="actions-bar">
        
        <!-- actions at the start of the actions bar -->
        <div class="actions">

            <!-- Filter button -->
            <div>
                <ButtonWithTooltip tooltip="Filter" icon="mdi-filter" @click="showFilterDialog = true" />
            </div>

        </div>
    </div>

    <!-- content -->
    <div id="content">
        <div id="content-title">
            Balance
        </div>
        <div class="scrollable">
            <v-container fluid>
                <v-row dense>
                    <v-col>
                        <v-card>
                            <v-card-title>
                                Income
                            </v-card-title>
                            <v-card-text>
                                <SummaryTable v-if="balanceSummary" :summary="balanceSummary.income" />
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
                                <SummaryTable v-if="balanceSummary" :summary="balanceSummary.expenses" />
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-card>
                            <v-card-title>
                                Savings
                            </v-card-title>
                            <v-card-text>
                                <SavingsTable v-if="balanceSummary" 
                                    :balanceSummary="balanceSummary"
                                />
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </div>
    </div>

    <!-- Filter dialog -->
    <v-dialog v-model="showFilterDialog">
        <Filter :defaults="filterParams" @close="showFilterDialog = false" @filter="handleFilter" />
    </v-dialog>

</template>
