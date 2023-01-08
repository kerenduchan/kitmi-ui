<script setup>
import { ref, computed } from 'vue'
import { formatNumber } from '@/composables/utils'

// props 
const props = defineProps({
    summary: Object,
})

console.log(props.groups)

const headers = computed(() => {
    return [
        '',
        ...props.summary.buckets,
        'Total',
    ]
})

</script>

<template>
    <v-table density="compact">
        <thead>
            <tr>
                <th v-for="header in headers" class="text-center table-header-cell">
                    {{ header }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="g in props.summary.groups">
                <td class="table-header-cell">{{ g.name }}</td>
                <td v-for="v in g.data " class="text-right">{{ formatNumber(v, 0) }}</td>
                <td class="text-right font-weight-bold">{{ formatNumber(g.total, 0) }}</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td class="table-header-cell font-weight-bold">Total</td>
                <td v-for="v in props.summary.totals" class="text-right font-weight-bold">{{ formatNumber(v, 0) }}</td>
            </tr>
        </tfoot>
    </v-table>

</template>

<style>
    .table-header-cell {
        background-color: lightgray;
        font-weight: bold;
    }

    .table-summary-cell {
        background-color: #FFF9E8;
        font-weight: bold;
    }

    table, th, td {
  border: 0.5px solid black;
}
</style>