import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

function createCategory() {
    // gql mutation for creating a category
    const { mutate: gqlCreateCategory, onDone, onError } = useMutation(gql`
        mutation createCategory ($name: String!, $isExpense: Boolean!) {
            createCategory (name: $name, isExpense: $isExpense) {
                id
                name
                isExpense
            }
        }
    `)

    return { gqlCreateCategory, onDone, onError }
}

export default createCategory