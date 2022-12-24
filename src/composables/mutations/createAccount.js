import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

function getCreateAccount() {
    // gql mutation for creating an account
    const { mutate: createAccount, onDone, onError } = useMutation(gql`
        mutation createAccount ($name: String!, $source: AccountSource!, $username: String!, $password: String!) {
            createAccount (name: $name, source: $source, username: $username, password: $password) {
                id
                name
            }
        }
    `)

    return { createAccount, onDone, onError }
}

export default getCreateAccount