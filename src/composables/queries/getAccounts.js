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
            }
        }
    `)

    const accounts = ref(null)
    const isReady = ref(false)

    onResult(queryResult => {
        accounts.value = queryResult.data.accounts
        isReady.value = true
    })

    return { accounts, isReady, refetch }
}

export default getAccounts