import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { ref } from 'vue'
import Payee from '@/composables/model/Payee'

function getPayees(vars) {
    const { onResult, refetch } = useQuery(gql`
    query getPayees($orderBy: String, $limit: Int, $offset: Int, $categorized: Boolean) {
        payees(
          orderBy: $orderBy
          limit: $limit
          offset: $offset
          filter: {categorized: $categorized}
        ) {
          totalItemsCount
          items {
            id
            name
            subcategoryId
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
        }
      }`, 
      vars)

    const payees = ref(null)
    const totalPayeesCount = ref(null)

    onResult(queryResult => {
        const data = queryResult.data.payees
        payees.value = data.items.map((p) => new Payee(p))
        totalPayeesCount.value = data.totalItemsCount
    })

    return { payees, totalPayeesCount, refetch }
}

export default getPayees