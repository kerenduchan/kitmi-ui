import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

function createSubcategory() {
    // gql mutation for creating a subcategory
    const { mutate: gqlCreateSubcategory, onDone, onError } = useMutation(gql`
        mutation createSubcategory ($categoryId: ID!, $name: String!) {
            createSubcategory (categoryId: $categoryId, name: $name) {
            id
            name
            }
        }
        `)
    return { gqlCreateSubcategory, onDone, onError }
}

function renameSubcategory() {
    // gql mutation for renaming a subcategory
    const { mutate: gqlRenameSubcategory, onDone, onError } =
        useMutation(gql`
      mutation renameSubcategory ($subcategoryId: ID!, $name: String!) {
        renameSubcategory (subcategoryId: $subcategoryId, name: $name) {
          id
          name
        }
      }
    `)
    return { gqlRenameSubcategory, onDone, onError }
}

function deleteSubcategory() {
    // gql mutation for deleting a subcategory
    const { mutate: gqlDeleteSubcategory, onDone, onError } =
        useMutation(gql`
      mutation deleteSubcategory ($subcategoryId: ID!) {
        deleteSubcategory (subcategoryId: $subcategoryId)
      }
    `)
    return { gqlDeleteSubcategory, onDone, onError }
}
export {
    createSubcategory,
    renameSubcategory,
    deleteSubcategory
}