import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { ref } from 'vue'
import Transaction from '@/composables/model/Transaction'

function getTransactions() {
    const { onResult, refetch } = useQuery(gql`
        query getTransactions {
            transactions {
                id
                date
                amount
                overrideSubcategory
                subcategoryId
                note
                account {
                    id
                    name
                }
                payee {
                    id
                    name
                    note
                    subcategory {
                        id
                        name
                        category {
                            id
                            name
                            isExpense
                            excludeFromReports
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
                        excludeFromReports
                    }
                }
            }
        }
    `)

    const transactions = ref(null)
    const isReady = ref(false)

    onResult(queryResult => {
        transactions.value = queryResult.data.transactions.map((p) => new Transaction(p))
        isReady.value = true
    })

    return { transactions, isReady, refetch }
}

export default getTransactions