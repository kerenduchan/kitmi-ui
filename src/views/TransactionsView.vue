<script setup>
import getTransactions from '../composables/getTransactions'
import getCategories from '../composables/getCategories'
import TransactionsList from '../components/TransactionsList.vue'

const { 
    transactions, 
    isReady: isTransactionsReady, 
    refetch: refetchTransactions 
    } = getTransactions()

const { 
    incomeCategories, 
    expenseCategories, 
    isReady: isCategoriesReady
} = getCategories()


function onChange() {
    console.log('A change ocurred. Refetching.')
    refetchTransactions()
}

</script>

<template>
    <div v-if="!isTransactionsReady || !isCategoriesReady">Loading...</div>
    <div v-else>
        <TransactionsList
            :transactions="transactions" 
            :incomeCategories="incomeCategories" 
            :expenseCategories="expenseCategories" 
            @change="onChange"/>
    </div>
</template>
