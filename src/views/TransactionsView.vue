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
import Transaction from '@/composables/model/Transaction'

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
const limit = 50

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

const scrollable = ref(null)
const transactions = ref(null)
const totalTransactionsCount = ref(null)

// get the first page of transactions (pagination)
const { onResult, refetch } = getTransactions(transactionsParams.value) 

onResult(res => {
    const data = res.data.transactions
    transactions.value = data.items.map((p) => new Transaction(p))
    totalTransactionsCount.value = data.totalItemsCount
    if(scrollable.value) {
        scrollable.value.scrollTo(0, 0)
    }
})

const pagesCount = computed(() => {
    return Math.ceil(parseFloat(totalTransactionsCount.value) / limit)
})

watch(page, () => {
    refetch(transactionsParams.value)
})

watch(uncategorized, () => {
    page.value = 1
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
    <!-- actions bar at the top -->
    <div id="actions-bar">
    
        <!-- actions at the start of the actions bar -->
        <div class="actions">

            <!-- Edit button -->
            <div>
                <ButtonWithTooltip 
                    tooltip="Edit transaction" 
                    icon="mdi-pencil"
                    :disabled="selectedTransaction === null"
                    @click="showEditDialog = true"
                />
            </div>

            <!-- divider -->
            <v-divider vertical />

            <!-- Uncategorized checkbox -->
            <div>
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

    <!-- content -->
    <div id="content" v-if="transactions">
        <div id="content-title">
            Transactions
        </div>
        <div id="content-main">
            <v-card variant="outlined">
                <v-card-text>
                    <div class="scrollable" ref="scrollable">
                        <!-- List (table) of transactions -->
                        <TransactionsList :selectedTransactionId="selectedTransactionId" :transactions="transactions" @select="handleSelect" />
                    </div>
                    <div class="footer">
                        <!-- pagination -->
                        <v-pagination density="compact" v-model="page" :length="pagesCount" total-visible="10" circle />
                    </div>
                </v-card-text>
            </v-card>
        </div>
    </div>

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
