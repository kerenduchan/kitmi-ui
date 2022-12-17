import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

function createSubcategory() {
    // gql mutation for creating a category
    const { mutate: gqlCreateSubcategory, onDone, onError } = useMutation(gql`
        mutation createSubcategory ($name: String!, $categoryId: ID!) {
            createSubcategory (name: $name, categoryId: $categoryId) {
                id
            }
        }
    `)

    return { gqlCreateSubcategory, onDone, onError }
}

export default createSubcategory