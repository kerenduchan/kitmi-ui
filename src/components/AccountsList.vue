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
    return props.selectedAccountId === account.id ? 'bg-secondary' : 'bg-surface'
}

// handle click on a row in the table (select the account)
function handleRowClicked(account) {
    // select or deselect
    emit('select', (account.id === props.selectedAccountId) ? null : account.id)
}

function source(account) {
    return account.source.toLowerCase()
}

</script>

<template>

    <table class="w-100">
        <thead>
            <tr>
                <th v-for="header in headers" class="bg-primary">
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
                <td class="aaa">{{ source(a) }}</td>
            </tr>
        </tbody>
    </table>

</template>

<style scoped>
th {
    z-index: 1;
    position: sticky;
    top: 0;
}

td {
    border-bottom: 1px solid var(--table-row-divider-color);
}

tbody>tr:last-child>td{
    border-bottom: none;
}

</style>

