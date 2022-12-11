<script setup>
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { ref } from 'vue'
import CategoriesList from '../components/CategoriesList.vue'

const { onResult, refetch } = useQuery(gql`
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
