<script setup>
import { def } from '@vue/shared';
import { ref } from 'vue'

const props = defineProps({
    defaults: Object
})

const emit = defineEmits([
    'close',
    'filter'
])

// Show only uncategorized filter (v-model for checkbox)
const uncategorized = ref(props.defaults.uncategorized)

function handleFilterClicked() {
    emit('filter', {
        uncategorized: uncategorized.value
    })
}

</script>

<template>
    <v-card>
        <v-card-title>Filter Transactions</v-card-title>
        <v-card-text>
            <!-- Uncategorized checkbox -->
            <v-checkbox-btn v-bind="props" label="Uncategorized" v-model="uncategorized" />

        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" @click="handleFilterClicked">Filter</v-btn>
            <v-btn color="primary" @click="emit('close')">Close</v-btn>
        </v-card-actions>
    </v-card>

</template>