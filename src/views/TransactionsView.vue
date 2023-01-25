<script setup>
import { ref, computed, watch } from 'vue'

// components
import ButtonWithTooltip from '@/components/ButtonWithTooltip.vue'
import Snackbar from '@/components/Snackbar.vue'
import TransactionsList from '@/components/TransactionsList.vue'
import EditTransaction from '@/components/EditTransaction.vue'

// composables
import snackbar from '@/composables/snackbar'
import getTransactions from '@/composables/queries/getTransactions'
import getCategories from '@/composables/queries/getCategories'
import Category from '@/composables/model/Category'
import getUpdateTransaction from '@/composables/mutations/updateTransaction'

// ----------------------------------------------------------------------------

// get categories
const categories = ref(null)

const { onResult: onCategoriesResult, refetch: refetchCategories } = getCategories()

onCategoriesResult(res => {
    categories.value = res.data.categories.map((p) => new Category(p))
})


// Show only uncategorized filter (v-model for checkbox)
const uncategorized = ref(false)

// ----------------------------------------------------------------------------
// get transactions with pagination
const limit = 20

// the current page (v-model for the v-pagination)
const page = ref(1)

// params to be passed to getTransactions
const transactionsParams = computed(() => {
    let params = {
        offset: (page.value - 1) * limit,
        limit,
        categorized: uncategorized.value ? false : null
    }
    return params
})

// get the first page of transactions (pagination)
const { transactions, totalTransactionsCount, refetch } = getTransactions(transactionsParams.value) 

const pagesCount = computed(() => {
    return Math.ceil(parseFloat(totalTransactionsCount.value) / limit)
})

watch(page, () => {
    refetch(transactionsParams.value)
})

watch(uncategorized, () => {
    refetch(transactionsParams.value)
})

// ----------------------------------------------------------------------------
// snackbar

const { showSnackbar, snackbarText, displaySnackbar } = snackbar()


// ----------------------------------------------------------------------------
// selected transaction

// The ID of the selected transaction
const selectedTransactionId = ref(null)

// The selected transaction
const selectedTransaction = computed(() => {
    if(selectedTransactionId.value === null) {
        return null
    }
    const found = transactions.value.find(t => t.id === selectedTransactionId.value)
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
    refetch(transactionsParams.value)
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
                <v-card v-if="transactions" title="Transactions" :subtitle="subtitle">
                    <v-card-text>
                        <!-- List (table) of transactions -->
                        <TransactionsList 
                            :selectedTransactionId="selectedTransactionId"
                            :transactions="transactions" 
                            @select="handleSelect"/>

                        <!-- pagination -->
                        <v-pagination 
                            v-model="page"
                            :length="pagesCount"
                            circle 
                        />
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
