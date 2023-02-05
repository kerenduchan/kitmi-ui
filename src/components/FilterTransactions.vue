<script setup>
import { ref } from 'vue'

const props = defineProps({
    payees: Object,
    defaults: Object
})

const emit = defineEmits([
    'close',
    'filter'
])

// Show only uncategorized filter (v-model for checkbox)
const uncategorized = ref(props.defaults.uncategorized)

// payee ID (v-model for autocomplete)
const payeeId = ref(props.defaults.payeeId)

function handleFilterClicked() {
    emit('filter', {
        uncategorized: uncategorized.value,
        payeeId: payeeId.value
    })
}

</script>

<template>
    <v-card>
        <v-card-title>Filter Transactions</v-card-title>
        <v-card-text>
            <!-- Uncategorized checkbox -->
            <v-checkbox-btn v-bind="props" label="Uncategorized" v-model="uncategorized" />

            <!-- Payee autocomplete -->
            <v-autocomplete clearable label="Payee" :items="payees" item-title="name" item-value="id"
                v-model="payeeId" />

        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" @click="handleFilterClicked">Filter</v-btn>
            <v-btn color="primary" @click="emit('close')">Close</v-btn>
        </v-card-actions>
    </v-card>

</template>