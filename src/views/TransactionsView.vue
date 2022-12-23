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
import updatePayeeSubcategory from '@/composables/mutations/updatePayeeSubcategory'
import updateTransactionSubcategory from '@/composables/mutations/updateTransactionSubcategory'

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

let isSaveOnPayee = false

const { 
    gqlUpdateTransactionSubcategory, 
    onDone: onUpdateTransactionDone, 
    onError: onUpdateTransactionError 
} = updateTransactionSubcategory()

const { 
    gqlUpdatePayeeSubcategory, 
    onDone: onUpdatePayeeDone, 
    onError: onUpdatePayeeError 
} = updatePayeeSubcategory()

// update the given subcategory ID on the payee 
// and clear the subcategory ID of the transaction
function handleSaveOnPayee(subcategoryId) {
    isSaveOnPayee = true
    const t = selectedTransaction.value
    // set the subcategoryId of the transaction to null
    if(t.subcategoryId !== null) {
        gqlUpdateTransactionSubcategory({
            transactionId: selectedTransactionId.value, 
            subcategoryId: null
        })
    }

    // update the subcategoryId of the payee
    gqlUpdatePayeeSubcategory({
        payeeId: t.payee.id, 
        subcategoryId
    })
}

onUpdatePayeeDone(() => {
    showEditDialog.value = false
    store.refetchPayees()
    displaySnackbar("Transaction updated.")
})

onUpdatePayeeError(() => {
    showEditDialog.value = false
    displaySnackbar("Failed to update transaction.")
})

// update the given subcategory ID on the transaction
function handleSaveOnTransaction(subcategoryId) {
    isSaveOnPayee = false
    gqlUpdateTransactionSubcategory({
        transactionId: selectedTransactionId.value, 
        subcategoryId
    })
}

onUpdateTransactionDone(() => {
    if(isSaveOnPayee) {
        return
    }
    showEditDialog.value = false
    store.refetchTransactions()
    displaySnackbar("Transaction updated.")
})

onUpdateTransactionError(() => {
    showEditDialog.value = false
    displaySnackbar("Failed to update transaction.")
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

    <!-- List (table) of transactions -->
    <TransactionsList 
        :selectedTransactionId="selectedTransactionId"
        :transactions="filteredTransactions" 
        @select="handleSelect"/>

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
            @saveOnPayee="handleSaveOnPayee" 
            @saveOnTransaction="handleSaveOnTransaction" 
        />
    </v-dialog>

</template>
