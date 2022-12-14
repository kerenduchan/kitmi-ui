<script setup>
import { ref, computed } from 'vue'
import { formatNumber } from '@/composables/utils'

// props 
const props = defineProps({
    transactions: Object
})

const headers = ref([
    'Date', 
    'Amount', 
    'Payee', 
    'Type', 
    'Category', 
    'Subcategory'
])

const showOnlyUncategorized = ref(false)

const filteredTransactions = computed(() => {
    if (showOnlyUncategorized.value) {
        return props.transactions.filter(t => t.isUncategorized)
    }
    return props.transactions
})

const sum = computed(() => {
    const tmp = props.transactions.reduce((partialSum, t) => partialSum + t.amount, 0)
    return formatNumber(tmp)
})

const selectedTransaction = ref(null)

function getClassForRow(transaction) {
    if(selectedTransaction.value === null) {
        return ''
    }
    return selectedTransaction.value.id === transaction.id ? 'selected-row' : ''
}

// handle click on a row in the table
function onRowClicked(transaction) {
    selectedTransaction.value = transaction
}

</script>

<template>

    <v-checkbox label="Show Only Uncategorized" v-model="showOnlyUncategorized"></v-checkbox>

    <v-table density="compact" height="550px" fixed-header>
        <thead>
            <tr>
                <th v-for="header in headers" class="text-left">
                    {{ header }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="t in filteredTransactions" :key="t.id" :class="getClassForRow(t)" @click="onRowClicked(t)">
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