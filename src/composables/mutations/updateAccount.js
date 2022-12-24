import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

function getUpdateAccount() {
    // gql mutation for updating an account
    const { mutate: updateAccount, onDone, onError } = useMutation(gql`
        mutation updateAccount (
            $accountId: ID!, 
            $name: String, 
            $source: AccountSource, 
            $username: String, 
            $password: String) {
            updateAccount (
                accountId: $accountId, 
                name: $name,
                source: $source,
                username: $username,
                password: $password
            ) {
                id
                name
                source
                username
            }
        }
    `)

    return { updateAccount, onDone, onError }
}

export default getUpdateAccount