<script setup>
import { ref, computed } from 'vue'
import { formatNumber, formatDate } from '@/composables/utils'

import IconWithTooltip from '@/components/IconWithTooltip.vue'
import TransactionsListForPayee from '@/components/TransactionsListForPayee.vue'

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

    <v-dialog v-model="showAllTransactionsDialog" width="600px">
        <v-card title="Transactions">
            <v-card-text>
                <TransactionsListForPayee :transactions="transactions"/>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="showAllTransactionsDialog = false">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>