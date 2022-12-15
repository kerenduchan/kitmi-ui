<script setup>
import { ref, computed } from 'vue'
import { formatNumber } from '@/composables/utils'
import { initFilteredList, getClassForRow, selectItem, filteredList } from '@/composables/filteredList'

// props 
const props = defineProps({
    transactions: Object
})

// emits
const emit = defineEmits([
    'selectedItemChanged'
])

const headers = ref([
    'Date', 
    'Amount', 
    'Payee', 
    'Type', 
    'Category', 
    'Subcategory'
])

const showOnlyUncategorized = ref(false)

// logic for filtering the list
function filter() {
    if (showOnlyUncategorized.value) {
        return props.transactions.filter(t => !t.isCategorized)
    }
    return props.transactions
}

// init the filtered list (see filteredList.js)
initFilteredList(filter, emit)

// the computed sum of the rows
const sum = computed(() => {
    const tmp = props.transactions.reduce((partialSum, t) => partialSum + t.amount, 0)
    return formatNumber(tmp)
})

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
            <tr v-for="t in filteredList" :key="t.id" :class="getClassForRow(t)" @click="selectItem(t)">
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