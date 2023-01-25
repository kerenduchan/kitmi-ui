import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

function getPayees(vars) {
    const { onResult, onError, refetch } = useQuery(gql`
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
        }
      }`, 
      vars,
      {
        fetchPolicy: "network-only"
      })

    onError(e => {
      console.error(e)
    })
    return { onResult, refetch }
}

export default getPayees