<script setup>
import { computed } from 'vue'
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
            <tr>
                <th v-for="header in headers" class="thead-cell summary-table-cell">
                    {{ header }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="g in props.summary.groups">
                <td class="row-title-cell summary-table-cell">{{ g.name }}</td>
                <td v-for="v in g.data " class="number-cell summary-table-cell">{{ formatNumber(v, 0) }}</td>
                <td class="sum-cell summary-table-cell">{{ formatNumber(g.total, 0) }}</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td class="row-title-cell summary-table-cell">Total</td>
                <td v-for="v in props.summary.bucketTotals" class="sum-cell summary-table-cell">{{ formatNumber(v, 0) }}</td>
                <td class="number-cell sum-total-cell summary-table-cell">{{ formatNumber(props.summary.sumTotal, 0) }}</td>
            </tr>
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