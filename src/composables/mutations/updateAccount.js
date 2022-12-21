import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

function updateAccount() {
    // gql mutation for updating an account
    const { mutate: gqlUpdateAccount, onDone, onError } = useMutation(gql`
        mutation updateAccount ($accountId: ID!, $name: String!) {
            updateAccount (accountId: $accountId, name: $name) {
                id
            }
        }
    `)

    return { gqlUpdateAccount, onDone, onError }
}

export default updateAccount