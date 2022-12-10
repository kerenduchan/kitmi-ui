<script setup>
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import Category from '../components/Category.vue'

const { result, loading, error, refetch } = useQuery(gql`
        query getCategories {
            categories {
                id
                name
                subcategories {
                    id
                    name
                }
            }
        }
    `)

function onCategoryChanged(categoryId) {
    console.log('Category changed (ID=' + categoryId + '). Refetching.')
    refetch()
}

</script>

<template>
    <h1>Categories</h1>
    <div v-if="loading">Loading...</div>
    <ul v-else-if="result && result.categories">
        <li v-for="c of result.categories" :key="c.id">
            <Category :category="c" @categoryChanged="onCategoryChanged"/>
        </li>
    </ul>
</template>
