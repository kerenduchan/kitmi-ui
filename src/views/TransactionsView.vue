<script setup>
import { ref, computed } from 'vue'
import TransactionsList from '@/components/TransactionsList.vue'
import getTransactions from '@/composables/queries/getTransactions'

const {
    transactions,
    isReady: isTransactionsReady,
    refetch: refetchTransactions
} = getTransactions()

const showOnlyUncategorized = ref(false)

const filteredTransactions = computed(() => {
    if(showOnlyUncategorized.value) {
        return transactions.value.filter(t => t.isUncategorized)
    }
    return transactions.value
})

</script>

<template>
    <div v-if="!isTransactionsReady">Loading...</div>
    <div v-else>
        <v-checkbox label="Show Only Uncategorized" v-model="showOnlyUncategorized"></v-checkbox>

        <TransactionsList :transactions="filteredTransactions" />
    </div>
</template>
