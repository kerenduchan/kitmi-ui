<script setup>
import { ref } from 'vue'
import TopBar from '@/components/TopBar.vue'
import TransactionsList from '@/components/TransactionsList.vue'
import getTransactions from '@/composables/queries/getTransactions'

const {
    transactions,
    isReady: isTransactionsReady,
    refetch: refetchTransactions
} = getTransactions()

const selectedTransaction = ref(null)

function onSelectedTransactionChanged(t) {
    selectedTransaction.value = t
}

function edit() {
    console.log('edit transaction')
}

function isTransactionSelected() {
    return selectedTransaction.value !== null
}

</script>

<template>
    <TopBar>
        <v-btn icon="mdi-pencil" :disabled="!isTransactionSelected()" @click="edit"></v-btn>
    </TopBar>

    <div v-if="!isTransactionsReady">Loading...</div>
    <div v-else>
        <TransactionsList 
            :transactions="transactions" 
            @selectedItemChanged="onSelectedTransactionChanged"/>
    </div>
</template>
