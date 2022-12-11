import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { ref } from 'vue'

function getCategories() {
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

    return { incomeCategories, expenseCategories, isReady, refetch }
}

export default getCategories