<script setup>
import CategoriesList from '../components/CategoriesList.vue'
import getCategories from '../composables/getCategories'

const { incomeCategories, expenseCategories, isReady, refetch } = getCategories()

function onChange() {
    console.log('A change ocurred. Refetching.')
    refetch()
}

</script>

<template>
    <div v-if="!isReady">Loading...</div>
    <div v-else>
        <CategoriesList :isExpense=false :categories="incomeCategories" @change="onChange"/>
        <CategoriesList :isExpense=true :categories="expenseCategories" @change="onChange"/>
    </div>
</template>
