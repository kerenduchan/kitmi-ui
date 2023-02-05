import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

function getAllPayeeNames() {
    const { onResult, onError, refetch } = useQuery(gql`
    query getAllPayeeNames {
        payees {
          items {
            id
            name
          }
        }
      }`)

    onError(e => {
      console.error(e)
    })
    return { onResult, refetch }
}

export default getAllPayeeNames