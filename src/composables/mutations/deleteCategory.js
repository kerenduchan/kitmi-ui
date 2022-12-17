import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

function deleteCategory() {
    // gql mutation for creating a category
    const { mutate: gqlDeleteCategory, onDone, onError } = useMutation(gql`
        mutation deleteCategory ($categoryId: ID!) {
            deleteCategory (categoryId: $categoryId)
        }
    `)

    return { gqlDeleteCategory, onDone, onError }
}

export default deleteCategory