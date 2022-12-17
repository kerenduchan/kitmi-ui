<script setup>
import { ref } from 'vue'
import TypeExpenseOrIncomeIcon from '@/components/TypeExpenseOrIncomeIcon.vue'

// props 
const props = defineProps({
    items: Object
})

// emits
const emit = defineEmits([
    'selectedItemChanged'
])

// headers for the payees table
const headers = ref([
    '',
    'Name', 
    'Category', 
    'Subcategory'
])

// the selected item
const selectedItem = ref(null)

// get the class for a selected row in the table
function getClassForRow(item) {
    return selectedItem.value?.id === item.id ? 'selected-row' : ''
}

// handle click on a row in the table (select the item)
function selectItem(item) {
    selectedItem.value = item
    emit('selectedItemChanged', selectedItem.value)
}

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
            <tr v-for="p in items" 
                :key="p.id" 
                :class="getClassForRow(p)" 
                @click="selectItem(p)"
            >
                <td><TypeExpenseOrIncomeIcon :type="p.type"/></td>
                <td>{{ p.name}}</td>
                <td>{{ p.categoryName }}</td>
                <td>{{ p.subcategoryName }}</td>
            </tr>
        </tbody>
    </v-table>
</template>