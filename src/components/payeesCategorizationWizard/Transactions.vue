<script setup>
import { computed } from 'vue'
import { formatNumber, formatDate } from '@/composables/utils'

const props = defineProps({
    transactions: Object
})

const hasTransactions = computed(() => {
    return props.transactions !== null && props.transactions.length > 0
})

const lastTransaction = computed(() => {
    if(hasTransactions.value) {
        return props.transactions.at(-1)
    }
    return null
})

</script>


<template>
    <!-- the transactions associated with this payee -->
    <v-expansion-panels v-if="hasTransactions">
        <v-expansion-panel elevation="0">
            <v-expansion-panel-title>
                Last Transaction: {{ formatNumber(lastTransaction.amount) }} at {{ formatDate(lastTransaction.date) }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
                <div v-for="t in transactions">
                    {{ formatNumber(t.amount) }} at {{ formatDate(t.date) }}
                </div>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>


</template>