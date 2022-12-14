<script setup>
import { ref, computed } from 'vue'
import { formatNumber } from '@/composables/utils'

// props 
const props = defineProps({
    transactions: Object
})

const headers = ref(['Date', 'Amount', 'Payee', 'Type', 'Category', 'Subcategory'])

const sum = computed(() => {
    const tmp = props.transactions.reduce((partialSum, t) => partialSum + t.amount, 0)
    return formatNumber(tmp)
})

</script>

<template>
    <v-table density="compact" height="550px" fixed-header>
        <thead>
            <tr>
                <th v-for="header in headers" class="text-left">
                    {{ header }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="t in props.transactions" :key="t.id">
                <td>{{ t.formattedDate }}</td>
                <td class="text-right">{{ t.formattedAmount }}</td>
                <td>{{ t.payeeName }}</td>
                <td>{{ t.type }}</td>
                <td>{{ t.categoryName }}</td>
                <td>{{ t.subcategoryName }}</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td>Total</td>
                <td class="text-right">{{ sum }}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </tfoot>
    </v-table>

</template>