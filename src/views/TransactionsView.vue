<script setup>
import { ref, computed } from 'vue'
import TopBar from '@/components/TopBar.vue'
import TransactionsList from '@/components/TransactionsList.vue'
import getTransactions from '@/composables/queries/getTransactions'

const {
    transactions,
    isReady: isTransactionsReady,
    refetch: refetchTransactions
} = getTransactions()

</script>

<template>
    <TopBar>
    </TopBar>

    <div v-if="!isTransactionsReady">Loading...</div>
    <div v-else>
        <TransactionsList :transactions="transactions" />
    </div>
</template>
