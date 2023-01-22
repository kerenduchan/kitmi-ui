import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

function getCategories() {

    // fetch the data from the server
    const { onResult, refetch } = useQuery(gql`
    query getCategories {
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
    `)

    return { onResult, refetch }
}

export default getCategories