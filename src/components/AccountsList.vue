<script setup>
import { ref } from 'vue'

// props 
const props = defineProps({
    accounts: Object,
    selectedAccountId: String
})

// emits
const emit = defineEmits([
    'select'
])

const headers = ref([
    'Name',
    'Source',
])

// get the class for a selected row in the table
function getClassForRow(account) {
    return props.selectedAccountId === account.id ? 'selected-row' : ''
}

// handle click on a row in the table (select the account)
function handleRowClicked(account) {
    // select or deselect
    emit('select', (account.id === props.selectedAccountId) ? null : account.id)
}

</script>

<template>

    <v-table density="compact" fixed-header>
        <thead>
            <tr>
                <th v-for="header in headers" class="text-left">
                    {{ header }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="a in accounts" 
                :key="a.id"
                :class="getClassForRow(a)" 
                @click="handleRowClicked(a)"
            >
                <td>{{ a.name }}</td>
                <td>{{ a.source }}</td>
            </tr>
        </tbody>
    </v-table>

</template>