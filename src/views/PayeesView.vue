<script setup>
import PayeesList from '../components/PayeesList.vue'
import getPayees from '../composables/getPayees'
import getCategories from '../composables/getCategories'

const { 
    payees, 
    isReady: isPayeesReady, 
    refetch: refetchPayees 
    } = getPayees()

const { 
    incomeCategories, 
    expenseCategories, 
    isReady: isCategoriesReady
} = getCategories()



function onChange() {
    console.log('A change ocurred. Refetching.')
    refetchPayees()
}

</script>

<template>
    <div v-if="!isPayeesReady || !isCategoriesReady">Loading...</div>
    <div v-else>
        <PayeesList 
            :payees="payees" 
            :incomeCategories="incomeCategories" 
            :expenseCategories="expenseCategories" 
            @change="onChange"/>
    </div>
</template>
