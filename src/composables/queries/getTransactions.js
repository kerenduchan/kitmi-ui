import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { ref } from 'vue'
import Transaction from '@/composables/model/Transaction'

function getTransactions(vars) {
    console.log('getTransactions')
    console.log(vars)
    const { onResult, onError, refetch } = useQuery(gql`
        query getTransactions(
            $pageNumber: Int, 
            $pageSize: Int,
            $orderBy: String) {
            transactions(
                pageNumber: $pageNumber, 
                pageSize: $pageSize,
                orderBy: $orderBy) {
                pagesCount
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
    const pagesCount = ref(null)

    onError(e => {
        console.error('getTransactions failed:')
        console.error(e)
    })

    onResult(queryResult => {
        const data = queryResult.data.transactions
        transactions.value = data.items.map((p) => new Transaction(p))
        pagesCount.value = data.pagesCount
    })

    return { 
        transactions, 
        pagesCount,
        refetch }
}

export default getTransactions