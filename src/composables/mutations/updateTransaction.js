import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

function getUpdateTransaction() {
    // gql mutation for updating the subcategory of a transaction
    const { mutate: updateTransaction, onDone, onError } = useMutation(gql`
        mutation updateTransaction ($transactionId: ID!, $subcategoryId: ID) {
            updateTransaction (transactionId: $transactionId, subcategoryId: $subcategoryId) {
                id
            }
        }
    `)

    return { updateTransaction, onDone, onError }
}

export default getUpdateTransaction