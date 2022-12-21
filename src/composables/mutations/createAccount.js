import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

function createAccount() {
    // gql mutation for creating an account
    const { mutate: gqlCreateAccount, onDone, onError } = useMutation(gql`
        mutation createAccount ($name: String!, $source: AccountSource!, $username: String!, $password: String!) {
            createAccount (name: $name, source: $source, username: $username, password: $password) {
                id
            }
        }
    `)

    return { gqlCreateAccount, onDone, onError }
}

export default createAccount