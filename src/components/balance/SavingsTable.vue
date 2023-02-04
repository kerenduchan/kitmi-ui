<script setup>
import { computed } from 'vue'

import SummaryTableHeaderRow from './SummaryTableHeaderRow.vue'
import SummaryTableBodyRow from './SummaryTableBodyRow.vue';
import SummaryTableFooterRow from './SummaryTableFooterRow.vue';

import { formatNumber, formatMonthAndYear } from '@/composables/utils'

// props 
const props = defineProps({
    balanceSummary: Object,
})

const headers = computed(() => {
    return [
        '',
        ...props.balanceSummary.income.buckets.map(b => formatMonthAndYear(b)),
        'Total',
    ]
})

</script>

<template>
    <div class="rounded">

        <v-table>
            <thead>
                <SummaryTableHeaderRow :values="headers" />
            </thead>
            <tbody>

                <SummaryTableBodyRow title="Income"
                    :values="balanceSummary.income.bucketTotals.map(v => formatNumber(v, 0))"
                    :total="formatNumber(balanceSummary.income.sumTotal, 0)" />

                <SummaryTableBodyRow title="Expenses"
                    :values="balanceSummary.expenses.bucketTotals.map(v => formatNumber(v, 0))"
                    :total="formatNumber(balanceSummary.expenses.sumTotal, 0)" />

            </tbody>
            <tfoot>

                <SummaryTableFooterRow title="Savings" :values="balanceSummary.savings.map(v => formatNumber(v, 0))"
                    :total="formatNumber(balanceSummary.savingsTotal, 0)" />

                <SummaryTableFooterRow title="%" :values="balanceSummary.savingsPercentages.map(v => '' + v + '%')"
                    :total="'' + balanceSummary.savingsTotalPercentage + '%'" />

            </tfoot>

        </v-table>
    </div>

</template>