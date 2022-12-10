<script setup>
import { useQuery, useMutation } from '@vue/apollo-composable'
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

    const { mutate: gqlCreateSubcategory } = useMutation(gql`
      mutation createSubcategory ($categoryId: ID!, $name: String!) {
        createSubcategory (categoryId: $categoryId, name: $name) {
          id
          name
        }
      }
    `)


function createSubcategory(categoryId, name) {
    console.log('create subcategory in view. category ID=' + categoryId + " subcategory name=" + name)
    gqlCreateSubcategory({ categoryId, name})
    refetch()
}

</script>

<template>
    <h1>Categories</h1>
    <div v-if="loading">Loading...</div>
    <ul v-else-if="result && result.categories">
        <li v-for="c of result.categories" :key="c.id">
            <Category :category="c" @createSubcategory="createSubcategory"/>
        </li>
    </ul>
</template>
