<script setup>
import PayeesList from '../components/PayeesList.vue'
import getPayees from '../composables/getPayees'

const {
    payees,
    isReady: isPayeesReady,
    refetch: refetchPayees
} = getPayees()

</script>

<template>
    <div v-if="!isPayeesReady">Loading...</div>
    <div v-else>
        <PayeesList :payees="payees" />
    </div>
</template>
