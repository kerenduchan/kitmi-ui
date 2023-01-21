import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { ref } from 'vue'

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

    const accounts = ref(null)

    onResult(queryResult => {
        accounts.value = queryResult.data.accounts
    })

    return { accounts, refetch }
}

export default getAccounts