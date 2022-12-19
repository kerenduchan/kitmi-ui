import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

function updateTransactionSubcategory() {
    // gql mutation for updating the subcategory of a transaction
    const { mutate: gqlUpdateTransactionSubcategory, onDone, onError } = useMutation(gql`
        mutation updateTransactionSubcategory ($transactionId: ID!, $subcategoryId: ID) {
            updateTransactionSubcategory (transactionId: $transactionId, subcategoryId: $subcategoryId) {
                id
            }
        }
    `)

    return { gqlUpdateTransactionSubcategory, onDone, onError }
}

export default updateTransactionSubcategory