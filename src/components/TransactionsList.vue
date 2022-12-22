<script setup>
import { ref, computed } from 'vue'
import TypeExpenseOrIncomeIcon from '@/components/TypeExpenseOrIncomeIcon.vue'
import { formatNumber } from '@/composables/utils'

// props 
const props = defineProps({
    selectedTransactionId: String,
    transactions: Object
})

// emits
const emit = defineEmits([
    'select'
])

const headers = ref([
    '',
    'Date', 
    'Amount', 
    'Payee', 
    'Category', 
    'Subcategory'
])

// get the class for a selected row in the table
function getClassForRow(transaction) {
    return props.selectedTransactionId === transaction.id ? 'selected-row' : ''
}

// handle click on a row in the table (select the transaction)
function handleRowClicked(transaction) {
    // select or deselect
    emit('select', (transaction.id === props.selectedTransactionId) ? null : transaction.id)
}

// the computed sum of the rows
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
            <tr v-for="t in transactions" 
                :key="t.id"
                :class="getClassForRow(t)" 
                @click="handleRowClicked(t)"
            >
                <td><TypeExpenseOrIncomeIcon :type="t.type"/></td>
                <td>{{ t.formattedDate }}</td>
                <td class="text-right">{{ t.formattedAmount }}</td>
                <td>{{ t.payeeName }}</td>
                <td>{{ t.categoryName }}</td>
                <td>{{ t.subcategoryName }}</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td></td>
                <td>Total</td>
                <td class="text-right">{{ sum }}</td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </tfoot>
    </v-table>

</template>