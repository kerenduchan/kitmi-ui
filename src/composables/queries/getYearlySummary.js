import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { ref } from 'vue'
import Transaction from '@/composables/model/Transaction'

function getYearlySummary() {
    const { onResult, refetch } = useQuery(gql`
        query getTransactions {
            transactions {
                id
                date
                amount
                account {
                    id
                    name
                }
                payee {
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

    const summary = ref(null)
    const isReady = ref(false)

    onResult(queryResult => {
        summary.value = queryResult.data.transactions.map((p) => new Transaction(p))
        isReady.value = true
    })

    return { summary, isReady, refetch }
}

export default getYearlySummary