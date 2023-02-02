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
    <v-table>
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
