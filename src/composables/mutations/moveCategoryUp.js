import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

function moveCategoryUp() {
    const { mutate: gqlMoveCategoryUp, onDone, onError } = useMutation(gql`
        mutation moveCategoryUp ($categoryId: ID!) {
            moveCategoryUp (categoryId: $categoryId)
        }
    `)

    return { gqlMoveCategoryUp, onDone, onError }
}

export default moveCategoryUp