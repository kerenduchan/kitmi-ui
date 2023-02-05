<script setup>
import { ref, computed, watch } from 'vue'

// components
import ActionsBar from '@/components/layout/ActionsBar.vue'
import Actions from '@/components/layout/Actions.vue'
import ViewContent from '@/components/layout/ViewContent.vue'
import ViewContentTitle from '@/components/layout/ViewContentTitle.vue'
import ViewContentSubtitle from '@/components/layout/ViewContentSubtitle.vue'
import ViewContentMain from '@/components/layout/ViewContentMain.vue'
import ScrollableContainerWithFooter from '@/components/ScrollableContainerWithFooter.vue'

import ButtonWithTooltip from '@/components/ButtonWithTooltip.vue'
import Snackbar from '@/components/Snackbar.vue'
import TransactionsList from '@/components/TransactionsList.vue'
import EditTransaction from '@/components/EditTransaction.vue'
import FilterTransactions from '../components/FilterTransactions.vue'

// composables
import snackbar from '@/composables/snackbar'
import getTransactions from '@/composables/queries/getTransactions'
import getCategories from '@/composables/queries/getCategories'
import getAllPayeeNames from '@/composables/queries/getAllPayeeNames'
import Category from '@/composables/model/Category'
import Payee from '@/composables/model/Payee'
import getUpdateTransaction from '@/composables/mutations/updateTransaction'
import Transaction from '@/composables/model/Transaction'

// ----------------------------------------------------------------------------

// get categories
const categories = ref(null)

const { onResult: onCategoriesResult, refetch: refetchCategories } = getCategories()

onCategoriesResult(res => {
    categories.value = res.data.categories.map((p) => Category.fromGql(p))
})

// ----------------------------------------------------------------------------

// get payee names (for filter)
const payees = ref(null)

const { onResult: onPayeesResult } = getAllPayeeNames()

onPayeesResult(res => {
    payees.value = res.data.payees.items.map((p) => Payee.fromGql(p))
})

// Show only uncategorized filter
const uncategorized = ref(false)

// show only transactions of this payee ID
const payeeId = ref(null)
const payeeName = computed(() => {
    if(payeeId.value) {
        return payees.value.find(p => p.id === payeeId.value).name
    }
    return null;
})

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
        categorized: uncategorized.value ? false : null,
        payeeId: payeeId.value
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
    transactions.value = data.items.map((p) => Transaction.fromGql(p))
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

// ----------------------------------------------------------------------------
// filter transactions

const showFilterDialog = ref(false)

const filterDefaults = computed(() => {
    return {
        uncategorized: uncategorized.value,
        payeeId: payeeId.value
    }
})

function applyFilter(filter) {
    showFilterDialog.value = false
    uncategorized.value = filter.uncategorized
    payeeId.value = filter.payeeId
    page.value = 1
    console.log(transactionsParams.value)
    refetch(transactionsParams.value)
}

const subtitle = computed(() => {
    let res = uncategorized.value ? 'Uncategorized transactions' : 'All transactions'
    if(payeeName.value) {
        res += ' of payee ' + payeeName.value
    }
    return res
})
</script> 

<template>
    <!-- actions bar at the top -->
    <ActionsBar>

        <!-- actions at the start of the actions bar -->
        <Actions>
            <!-- Edit button -->
            <ButtonWithTooltip 
                tooltip="Edit transaction" 
                icon="mdi-pencil"
                :disabled="selectedTransaction === null"
                @click="showEditDialog = true"
            />
        </Actions>

        <!-- actions at the end of the actions bar -->
        <Actions>
            <!-- Filter -->
            <ButtonWithTooltip 
                tooltip="Filter"
                icon="mdi-filter"
                @click="showFilterDialog = true"
            />

        </Actions>

    </ActionsBar>

    <!-- content, below the actions bar -->
    <ViewContent v-if="transactions">

        <!-- content title -->
        <ViewContentTitle text="Transactions" />
        <ViewContentSubtitle :text="subtitle" @click="showFilterDialog = true"/>

        <!-- content body -->
        <ViewContentMain noscroll>

            <ScrollableContainerWithFooter>
                <template v-slot:main>
                    <!-- List (table) of transactions -->
                    <TransactionsList :selectedTransactionId="selectedTransactionId" :transactions="transactions" @select="handleSelect" />
                </template>
                <template v-slot:footer>
                    <v-pagination density="compact" v-model="page" :length="pagesCount" total-visible="10" />
                </template>
            </ScrollableContainerWithFooter>
        </ViewContentMain>
    </ViewContent>

    <!-- snackbar -->
    <Snackbar 
        :show="showSnackbar" 
        :text="snackbarText"
        @close="showSnackbar = false"/>

    <!-- Edit selected transaction dialog -->
    <v-dialog v-model="showEditDialog" width="800">
        <EditTransaction 
            :transaction="selectedTransaction"
            :categories="categories" 
            @close="showEditDialog = false"
            @save="save" 
        />
    </v-dialog>

    <!-- Filter transactions dialog -->
    <v-dialog v-model="showFilterDialog" width="800">
        <FilterTransactions
            :defaults="filterDefaults"
            :payees="payees"
            @close="showFilterDialog = false"
            @filter="applyFilter"
        />
    </v-dialog>


</template>
