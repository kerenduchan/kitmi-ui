import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

function getUpdateCategory() {
    // gql mutation for updating a category
    const { mutate: gqlUpdateCategory, onDone, onError } = useMutation(gql`
        mutation updateCategory ($categoryId: ID!, $name: String!, $isExpense: Boolean!) {
            updateCategory (categoryId: $categoryId, name: $name, isExpense: $isExpense) {
                id
                name
            }
        }
    `)

    return { gqlUpdateCategory, onDone, onError }
}

export default getUpdateCategory