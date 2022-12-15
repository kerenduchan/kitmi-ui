<script setup>
import { ref, computed } from 'vue'
import { formatNumber } from '@/composables/utils'

// props 
const props = defineProps({
    rows: Object
})

const headers = ref([
    'Category',
    'Subcategory',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
    'Total',
])

const monthlySumTotals = computed(() => {
    let res = []
    for (let i = 0; i < 12; i++) {
        res.push(0)
    }
    props.rows.forEach(row => {
        for (let i = 0; i < 12; i++) {
            res[i] += row.monthlySums[i]
        }
    })

    return res
})

const yearlySumTotal = computed(() => {
    return props.rows.reduce((sum, row) => sum + row.totalSum, 0)
})

</script>

<template>
    <v-table density="compact">
        <thead>
            <tr>
                <th v-for="header in headers" class="text-left">
                    {{ header }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="r in props.rows">
                <td>{{ r.subcategory.category.name }}</td>
                <td>{{ r.subcategory.name }}</td>
                <td v-for="sum in r.monthlySums" class="text-right">{{ formatNumber(sum) }}</td>
                <td class="text-right">{{ formatNumber(r.totalSum) }}</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td>Total</td>
                <td></td>
                <td v-for="sum in monthlySumTotals" class="text-right">{{ formatNumber(sum) }}</td>
                <td class="text-right">{{ formatNumber(yearlySumTotal) }}</td>
            </tr>
        </tfoot>
    </v-table>

</template>