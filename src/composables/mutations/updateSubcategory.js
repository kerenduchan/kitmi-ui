import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

function getUpdateSubcategory() {
    // gql mutation for updating a category
    const { mutate: updateSubcategory, onDone, onError } = useMutation(gql`
        mutation updateSubcategory ($subcategoryId: ID!, $name: String!, $categoryId: ID!) {
            updateSubcategory (subcategoryId: $subcategoryId, name: $name, categoryId: $categoryId) {
                id
                name
                categoryId
            }
        }
    `)

    return { updateSubcategory, onDone, onError }
}

export default getUpdateSubcategory