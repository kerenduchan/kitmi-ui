import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

function getAccounts() {
    const { onResult, refetch } = useQuery(gql`
        query getAccounts {
            accounts {
                id
                name
                source
                username
            }
        }
    `)

    return { onResult, refetch }
}

export default getAccounts