<script setup>
import { ref } from 'vue'
import TypeIcon from '@/components/TypeIcon.vue'

// props 
const props = defineProps({
    selectedPayeeId: String,
    payees: Object
})

// emits
const emit = defineEmits([
    'select'
])

// headers for the payees table
const headers = ref([
    '',
    'Name', 
    'Category', 
    'Subcategory',
    'Note'
])

// get the class for a selected row in the table
function getClassForRow(payee) {
    return props.selectedPayeeId === payee.id ? 'selected-row' : ''
}

// handle click on a row in the table (select the payee)
function handleRowClicked(payee) {
    // select or deselect
    emit('select', (payee.id === props.selectedPayeeId) ? null : payee.id)
}

</script>

<template>
    <table>
        <thead>
            <tr>
                <th v-for="header in headers" class="text-left">
                    {{ header }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="p in payees" 
                :key="p.id" 
                :class="getClassForRow(p)" 
                @click="handleRowClicked(p)"
            >
                <td><TypeIcon :type="p.type" :isExcluded="p.excludeFromReports"/></td>
                <td>{{ p.name}}</td>
                <td>{{ p.categoryName }}</td>
                <td>{{ p.subcategoryName }}</td>
                <td>{{ p.note }}</td>
            </tr>
        </tbody>
    </table>
</template>