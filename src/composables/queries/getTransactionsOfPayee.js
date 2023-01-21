import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { ref } from 'vue'
import Transaction from '@/composables/model/Transaction'

function getTransactionsOfPayee(vars) {
    const { onResult, onError, refetch } = useQuery(gql`
    query getTransactionsOfPayee($payeeId: Int!, $limit: Int, $offset: Int) {
        transactions(
          orderBy: "date"
          limit: $limit
          offset: $offset
          filter: {payeeId: $payeeId}
        ) {
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
      }`, vars)

    const transactions = ref(null)
    const totalTransactionsCount = ref(null)

    onError(e => {
        console.error('getTransactions failed:')
        console.error(e)
    })

    onResult(queryResult => {
        const data = queryResult.data.transactions
        transactions.value = data.items.map((p) => new Transaction(p))
        totalTransactionsCount.value = data.totalItemsCount
    })


    return { 
        transactions, 
        totalTransactionsCount,
        refetch }
}

export default getTransactionsOfPayee