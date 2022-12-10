<script setup>
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

const { result } = useQuery(gql`
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


</script>

<template>
    <h1>Categories</h1>
    <ul v-if="result && result.categories">
        <li v-for="c of result.categories" :key="c.id">
          ({{ c.id }}) {{ c.name }}
              <ul v-if="c.subcategories">
                <li v-for="s of c.subcategories" :key="s.id">
                  ({{ s.id }}) {{ s.name }}
                </li>
            </ul>
        </li>
    </ul>
</template>
