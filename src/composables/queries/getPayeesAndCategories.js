import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

function getPayeesAndCategories(vars) {
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
        categories {
          id
          name
          isExpense
          excludeFromReports
          subcategories {
            id
            name
            categoryId
          }
        }
      }
    `, 
      vars)

    return { onResult, refetch }
}

export default getPayeesAndCategories