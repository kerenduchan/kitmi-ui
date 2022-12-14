<script setup>
import { ref, computed } from 'vue'

// components
import ButtonWithTooltip from '@/components/ButtonWithTooltip.vue'
import Snackbar from '@/components/Snackbar.vue'
import TransactionsList from '@/components/TransactionsList.vue'
import EditTransaction from '@/components/EditTransaction.vue'

// composables
import getStore from '@/composables/store'
import snackbar from '@/composables/snackbar'
import getUpdateTransaction from '@/composables/mutations/updateTransaction'

// ----------------------------------------------------------------------------
// store

const store = getStore()
const categories = store.categories
const transactions = store.transactions

// ----------------------------------------------------------------------------
// snackbar

const { showSnackbar, snackbarText, displaySnackbar } = snackbar()

// ----------------------------------------------------------------------------
// show only uncategorized transactions

// Show only uncategorized filter (v-model for checkbox)
const uncategorized = ref(false)

// The transactions, after applying the filter
const filteredTransactions = computed(() => {
    if(uncategorized.value === true) {
        return transactions.value.filter(t => !t.isCategorized)
    }
    return transactions.value
})

// ----------------------------------------------------------------------------
// selected transaction

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

// ----------------------------------------------------------------------------
// edit transaction

// edit dialog
const showEditDialog = ref(false)

const { 
    updateTransaction, 
    onDone: onUpdateTransactionDone, 
    onError: onUpdateTransactionError 
} = getUpdateTransaction()

function save(transaction) {
    showEditDialog.value = false
    updateTransaction(transaction)
}

onUpdateTransactionDone(() => {
    store.refetchTransactions()
    displaySnackbar("Transaction updated.")
})

onUpdateTransactionError((e) => {
    showEditDialog.value = false
    console.log(e)
    displaySnackbar("Failed to update transaction.")
})

const subtitle = computed(() => {
    return uncategorized.value ? 'Uncategorized' : ''
})

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

    <v-container fluid>
        <v-row dense>
            <v-col>
                <v-card title="Transactions" :subtitle="subtitle">
                    <v-card-text>
                        <!-- List (table) of transactions -->
                        <TransactionsList 
                            :selectedTransactionId="selectedTransactionId"
                            :transactions="filteredTransactions" 
                            @select="handleSelect"/>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>

    <!-- snackbar -->
    <Snackbar 
        :show="showSnackbar" 
        :text="snackbarText"
        @close="showSnackbar = false"/>

    <!-- Edit selected transaction dialog -->
    <v-dialog v-model="showEditDialog">
        <EditTransaction 
            :transaction="selectedTransaction"
            :categories="categories" 
            @close="showEditDialog = false"
            @save="save" 
        />
    </v-dialog>

</template>
