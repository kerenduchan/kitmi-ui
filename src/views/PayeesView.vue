<script setup>
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { ref } from 'vue'
import PayeesList from '../components/PayeesList.vue'

const { onResult, refetch } = useQuery(gql`
        query getPayees {
            payees {
                id
                name
                subcategory {
                    id
                    name
                    category {
                        id
                        name
                        isExpense
                    }
                }
            }
        }
    `)

const isReady = ref(false)

const payees = ref(null)

onResult(queryResult => {
  payees.value = queryResult.data.payees
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
        <PayeesList :payees="payees" @change="onChange"/>
    </div>
</template>
