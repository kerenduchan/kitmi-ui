import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

function deleteSubcategory() {
    // gql mutation for creating a category
    const { mutate: gqlDeleteSubcategory, onDone, onError } = useMutation(gql`
        mutation deleteSubcategory ($subcategoryId: ID!) {
            deleteSubcategory (subcategoryId: $subcategoryId) {
                count
            }
        }
    `)

    return { gqlDeleteSubcategory, onDone, onError }
}

export default deleteSubcategory