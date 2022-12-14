<script setup>
import { ref, watch, computed, watchEffect } from 'vue'

// props 
const props = defineProps({
    payees: Object
})

// emits
const emit = defineEmits([
    'selectedPayeeChanged'
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

// the last payee that the user selected (clicked on the row in the table)
const selectedPayee = ref(null)

// filtered payees to display in the table
const filteredPayees = computed(() => {
    if(showOnlyUncategorized.value === true) {
        return props.payees.filter(p => !p.isCategorized)
    }
    return props.payees
})

const filteredSelectedPayee = computed(() => {
    if(showOnlyUncategorized.value === true && 
        selectedPayee.value !== null && 
        selectedPayee.value.isCategorized) {
        return null
    }
    return selectedPayee.value
})

// handle click on a row in the table
function onRowClicked(payee) {
    selectedPayee.value = payee
}

function getClassForPayeeRow(payee) {
    return selectedPayee.value?.id === payee.id ? 'selected-row' : ''
}

// filteredSelectedPayee changes either as a result of a click on a row
// or a change in the filtering criteria
watch(filteredSelectedPayee, () => {
    emit('selectedPayeeChanged', filteredSelectedPayee.value)
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
            <tr v-for="p in filteredPayees" :key="p.id" :class="getClassForPayeeRow(p)" @click="onRowClicked(p)">
                <td>{{ p.name}}</td>
                <td>{{ p.type }}</td>
                <td>{{ p.categoryName }}</td>
                <td>{{ p.subcategoryName }}</td>
            </tr>
        </tbody>
    </v-table>
</template>

<style scoped>
    .selected-row {
        background-color: #D6DBDF;
    }
</style>