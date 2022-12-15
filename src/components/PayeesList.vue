<script setup>
import { ref } from 'vue'
import { initFilteredList, getClassForRow, selectItem, filteredList } from '@/composables/filteredList'

// props 
const props = defineProps({
    payees: Object
})

// emits
const emit = defineEmits([
    'selectedItemChanged'
])

// headers for the payees table
const headers = ref([
    'Name', 
    'Type', 
    'Category', 
    'Subcategory'
])

// whether to show only uncategorized payees (v-model for the checkbox)
const showOnlyUncategorized = ref(false)

function filter() {
    if (showOnlyUncategorized.value) {
        return props.payees.filter(p => !p.isCategorized)
    }
    return props.payees
}

initFilteredList(filter, emit)

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
            <tr v-for="p in filteredList" :key="p.id" :class="getClassForRow(p)" @click="selectItem(p)">
                <td>{{ p.name}}</td>
                <td>{{ p.type }}</td>
                <td>{{ p.categoryName }}</td>
                <td>{{ p.subcategoryName }}</td>
            </tr>
        </tbody>
    </v-table>
</template>