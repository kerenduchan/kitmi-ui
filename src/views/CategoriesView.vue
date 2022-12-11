<script setup>
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { ref } from 'vue'
import CategoriesList from '../components/CategoriesList.vue'

const { result, loading, onResult, refetch } = useQuery(gql`
        query getCategories {
            categories {
                id
                name
                isExpense
                subcategories {
                    id
                    name
                }
            }
        }
    `)

const incomeCategories = ref(null)
const expenseCategories = ref(null)
const isReady = ref(false)

onResult(queryResult => {
  incomeCategories.value = queryResult.data.categories.filter(c => !c.isExpense)
  expenseCategories.value = queryResult.data.categories.filter(c => c.isExpense)
  isReady.value = true
})

function onCategoryChanged(categoryId) {
    console.log('Category changed (ID=' + categoryId + '). Refetching.')
    refetch()
}

</script>

<template>
    <div v-if="!isReady">Loading...</div>
    <div v-else>
        <CategoriesList :isExpense=false :categories="incomeCategories" @categoryChanged="onCategoryChanged"/>
        <CategoriesList :isExpense=true :categories="expenseCategories" @categoryChanged="onCategoryChanged"/>
    </div>
</template>
