<script setup>
import { ref, computed } from 'vue'
import ButtonWithTooltip from '@/components/ButtonWithTooltip.vue';
import TransactionsList from '@/components/TransactionsList.vue'
import EditTransaction from '@/components/EditTransaction.vue'
import getStore from '@/composables/store'

const store = getStore()
const categories = store.categories
const transactions = store.transactions

// Show only uncategorized filter (v-model for checkbox)
const uncategorized = ref(false)

// The transactions, after applying the filter
const filteredTransactions = computed(() => {
    if(uncategorized.value === true) {
        return transactions.value.filter(t => !t.isCategorized)
    }
    return transactions.value
})

// The ID of the selected transaction
const selectedTransactionId = ref(null)

// The selected transaction
const selectedTransaction = computed(() => {
    if(selectedTransactionId.value === null) {
        return null
    }
    const found = filteredTransactions.value.find(t => t.id === selectedTransactionId.value)
    return found ? found : null
})

// update the selected transaction ID
function handleSelect(id) {
    selectedTransactionId.value = id
}

// edit dialog
const showEditDialog = ref(false)

function handlePayeeChange() {
    showEditDialog.value = false
    store.refetchPayees()
}

function handleTransactionChange() {
    showEditDialog.value = false
    store.refetchTransactions()
}

</script> 

<template>
    <div class="top-bar">
        <div class="top-bar-left">

            <!-- Edit button -->
            <div class="top-bar-action">
                <ButtonWithTooltip 
                    tooltip="Edit transaction" 
                    icon="mdi-pencil"
                    :disabled="selectedTransaction === null"
                    @click="showEditDialog = true"
                />
            </div>

            <v-divider vertical />


            <!-- Uncategorized checkbox -->
            <div class="top-bar-action">
                <v-tooltip text="Toggle show only uncategorized" location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-checkbox-btn 
                            v-bind="props"
                            label="Uncategorized" 
                            v-model="uncategorized">
                        </v-checkbox-btn>
                    </template>
                </v-tooltip>
            </div>
        </div>
    </div>
    <v-divider />

    <!-- List (table) of transactions -->
    <TransactionsList 
        :transactions="filteredTransactions" 
        @select="handleSelect"/>

    <!-- Edit selected transaction dialog -->
    <v-dialog v-model="showEditDialog">
        <EditTransaction 
            :transaction="selectedTransaction"
            :categories="categories" 
            @close="showEditDialog = false"
            @payeeChanged="handlePayeeChange" 
            @transactionChanged="handleTransactionChange" 
        />
    </v-dialog>

</template>
