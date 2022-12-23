import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

function getCreateAccount() {
    // gql mutation for creating an account
    const { mutate: gqlCreateAccount, onDone, onError } = useMutation(gql`
        mutation createAccount ($name: String!, $source: AccountSource!, $username: String!, $password: String!) {
            createAccount (name: $name, source: $source, username: $username, password: $password) {
                id
                name
            }
        }
    `)

    return { gqlCreateAccount, onDone, onError }
}

export default getCreateAccount