<script setup>
import { computed } from 'vue'
import SummaryTableHeaderRow from './SummaryTableHeaderRow.vue'
import SummaryTableBodyRow from './SummaryTableBodyRow.vue';
import SummaryTableFooterRow from './SummaryTableFooterRow.vue';

import { formatNumber, formatMonthAndYear } from '@/composables/utils'

// props 
const props = defineProps({
    summary: Object,
})

const headers = computed(() => {
    return [
        '',
        ...props.summary.buckets.map(b => formatMonthAndYear(b)),
        'Total',
    ]
})

</script>

<template>
    <v-table density="compact" class="summary-table-cell">
        <thead>
            <SummaryTableHeaderRow :values="headers" />
        </thead>
        <tbody>
            <SummaryTableBodyRow v-for="g in props.summary.groups" 
                :title="g.name"
                :values="g.data.map(d => formatNumber(d, 0))"
                :total="formatNumber(g.total, 0)"
            />
        </tbody>
        <tfoot>
            <SummaryTableFooterRow 
                title="Total"
                :values="props.summary.bucketTotals.map(d => formatNumber(d, 0))"
                :total="formatNumber(props.summary.sumTotal, 0) "
            />
        </tfoot>
    </v-table>

</template>

<style>
    .thead-cell {
        background-color: lightgray;
        text-align: center !important;
        font-weight: bold;
    }

    .row-title-cell {
        background-color: lightgray;
        font-weight: bold;
    }

    .number-cell {
        text-align: right !important;
    }

    .sum-cell {
        text-align: right !important;
        font-weight: bold;
        background-color: #f3f3f3;
    }

    .sum-total-cell {
        text-align: right !important;
        font-weight: bold;
        background-color: #fff2cc;
    }

    .summary-table-cell {
        border: 0.5px solid black;
    }
</style>