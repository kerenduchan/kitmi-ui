import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

function updateSubcategory() {
    // gql mutation for updating a category
    const { mutate: gqlUpdateSubcategory, onDone, onError } = useMutation(gql`
        mutation updateSubcategory ($subcategoryId: ID!, $name: String!, $categoryId: ID!) {
            updateSubcategory (subcategoryId: $subcategoryId, name: $name, categoryId: $categoryId) {
                id
            }
        }
    `)

    return { gqlUpdateSubcategory, onDone, onError }
}

export default updateSubcategory