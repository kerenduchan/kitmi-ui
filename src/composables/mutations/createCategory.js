import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

function getCreateCategory() {
    // gql mutation for creating a category
    const { mutate: gqlCreateCategory, onDone, onError } = useMutation(gql`
        mutation createCategory ($name: String!, $isExpense: Boolean!) {
            createCategory (name: $name, isExpense: $isExpense) {
                id
                name
            }
        }
    `)

    return { gqlCreateCategory, onDone, onError }
}

export default getCreateCategory