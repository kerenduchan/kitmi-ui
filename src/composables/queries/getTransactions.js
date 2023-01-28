import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

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

    onError(e => {
        console.error('getTransactions failed:')
        console.error(e)
    })

    return { 
        onResult,
        refetch 
    }
}

export default getTransactions