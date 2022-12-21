<script setup>
import { ref, watch, watchEffect } from 'vue'

// props 
const props = defineProps({
    accounts: Object,
    forceSelectedAccountId: String
})

// emits
const emit = defineEmits([
    'select'
])

const headers = ref([
    'Name',
    'Source',
])

// the ID of the selected account
const selectedAccountId = ref(null)

// get the class for a selected row in the table
function getClassForRow(account) {
    return selectedAccountId.value === account.id ? 'selected-row' : ''
}

// handle click on a row in the table (select the account)
function select(account) {
    selectedAccountId.value = account.id
}

watchEffect(() => {
    if(props.forceSelectedAccountId !== null) {
        if(selectedAccountId.value === null || 
        (selectedAccountId.value != props.forceSelectedAccountId)) {
            // the parent component forced an account to be selected.
            // this happens when a new account is created.
            selectedAccountId.value = props.forceSelectedAccountId
        }
    }
})

watch(selectedAccountId, () => {
    emit('select', selectedAccountId.value)
})

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
                @click="select(a)"
            >
                <td>{{ a.name }}</td>
                <td>{{ a.source }}</td>
            </tr>
        </tbody>
    </v-table>

</template>