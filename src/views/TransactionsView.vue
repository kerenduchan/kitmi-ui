<script setup>
import TransactionsList from '@/components/TransactionsList.vue'
import getTransactions from '@/composables/queries/getTransactions'

const {
    transactions,
    isReady: isTransactionsReady,
    refetch: refetchTransactions
} = getTransactions()

</script>

<template>
    <div v-if="!isTransactionsReady">Loading...</div>
    <div v-else>
        <TransactionsList :transactions="transactions" />
    </div>
</template>
