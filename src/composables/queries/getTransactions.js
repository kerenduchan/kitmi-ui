import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { ref } from 'vue'
import Transaction from '@/composables/model/Transaction'

function getTransactions(vars) {
    const { onResult, onError, refetch } = useQuery(gql`
        query getTransactions(
            $orderBy: String,
            $limit: Int,
            $offset: Int
            $categorized: Boolean) {
            transactions(
                orderBy: $orderBy,
                limit: $limit,
                offset: $offset
                filter: {categorized: $categorized}) {
                totalItemsCount
                items {
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
        }
    `, vars)

    const transactions = ref(null)
    const totalItemsCount = ref(null)

    onError(e => {
        console.error('getTransactions failed:')
        console.error(e)
    })

    onResult(queryResult => {
        const data = queryResult.data.transactions
        transactions.value = data.items.map((p) => new Transaction(p))
        totalItemsCount.value = data.totalItemsCount
    })

    return { 
        transactions, 
        totalTransactionsCount: totalItemsCount,
        refetch }
}

export default getTransactions