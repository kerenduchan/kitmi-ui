<script setup>
import { ref, computed } from 'vue'
import { formatNumber, formatDate } from '@/composables/utils'

import IconWithTooltip from '@/components/IconWithTooltip.vue'
import TransactionsTable from './TransactionsTable.vue'

const props = defineProps({
    transactions: Object,
    payeeName: String
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

const showAllTransactionsDialog = ref(false)

</script>


<template>
    <!-- the transactions associated with this payee -->
    <div class="d-flex gap-3">
        <div>
            Last Transaction: {{ formatNumber(lastTransaction.amount) }} at {{ formatDate(lastTransaction.date) }} 
        </div>
        <IconWithTooltip @click="showAllTransactionsDialog = true" tooltip="show all" icon="mdi-dots-horizontal"/>
    </div>

    <v-dialog v-model="showAllTransactionsDialog" width="400px">
        <v-card class="d-flex flex-column">
            <v-card-title>Transactions</v-card-title>
            <v-card-text class="flex-grow-1 d-flex flex-column overflow-y-hidden align-center py-1">
                {{ payeeName }}
                <div class="flex-grow-1 overflow-y-auto rounded w-100">
                    <TransactionsTable :transactions="transactions"/>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="showAllTransactionsDialog = false">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>