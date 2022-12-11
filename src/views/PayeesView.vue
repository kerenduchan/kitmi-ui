<script setup>
import PayeesList from '../components/PayeesList.vue'
import getPayees from '../composables/getPayees'

const { payees, isReady, refetch } = getPayees()

function onChange() {
    console.log('A change ocurred. Refetching.')
    refetch()
}

</script>

<template>
    <div v-if="!isReady">Loading...</div>
    <div v-else>
        <PayeesList :payees="payees" @change="onChange"/>
    </div>
</template>
