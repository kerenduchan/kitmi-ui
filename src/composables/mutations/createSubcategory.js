import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

function getCreateSubcategory() {
    // gql mutation for creating a category
    const { mutate: createSubcategory, onDone, onError } = useMutation(gql`
        mutation createSubcategory ($name: String!, $categoryId: ID!) {
            createSubcategory (name: $name, categoryId: $categoryId) {
                id
                name
                categoryId
            }
        }
    `)

    return { createSubcategory, onDone, onError }
}

export default getCreateSubcategory