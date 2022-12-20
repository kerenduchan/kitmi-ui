<script setup>
import { ref, computed } from 'vue'
import TypeExpenseOrIncomeIcon from '@/components/TypeExpenseOrIncomeIcon.vue'
import { formatNumber } from '@/composables/utils'

// props 
const props = defineProps({
    items: Object
})

// emits
const emit = defineEmits([
    'selectedItemChanged'
])

const headers = ref([
    '',
    'Date', 
    'Amount', 
    'Payee', 
    'Category', 
    'Subcategory'
])

// the ID of the selected item
const selectedItemId = ref(null)

// get the class for a selected row in the table
function getClassForRow(item) {
    return selectedItemId.value === item.id ? 'selected-row' : ''
}

// handle click on a row in the table (select the item)
function selectItem(item) {
    selectedItemId.value = item.id
    emit('selectedItemChanged', selectedItemId.value)
}

// the computed sum of the rows
const sum = computed(() => {
    const tmp = props.items.reduce((partialSum, t) => partialSum + t.amount, 0)
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
            <tr v-for="t in items" 
                :key="t.id"
                :class="getClassForRow(t)" 
                @click="selectItem(t)"
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