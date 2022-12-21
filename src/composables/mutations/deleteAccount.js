import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

function deleteAccount() {
    // gql mutation for deleting an account
    const { mutate: gqlDeleteAccount, onDone, onError } = useMutation(gql`
        mutation deleteAccount ($accountId: ID!) {
            deleteAccount (accountId: $accountId)
        }
    `)

    return { gqlDeleteAccount, onDone, onError }
}

export default deleteAccount