import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

function moveCategoryDown() {
    const { mutate: gqlMoveCategoryDown, onDone, onError } = useMutation(gql`
        mutation moveCategoryDown ($categoryId: ID!) {
            moveCategoryDown (categoryId: $categoryId) {
                id
            }
        }
    `)

    return { gqlMoveCategoryDown, onDone, onError }
}

export default moveCategoryDown