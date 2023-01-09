import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

function getUpdateTransaction() {
    // gql mutation for updating the subcategory of a transaction
    const { mutate: updateTransaction, onDone, onError } = useMutation(gql`
        mutation updateTransaction ($transactionId: ID!, 
                                    $overrideSubcategory: Boolean,
                                    $subcategoryId: ID,
                                    $note: String) {
            updateTransaction (transactionId: $transactionId, 
                               overrideSubcategory: $overrideSubcategory,
                               subcategoryId: $subcategoryId,
                               note: $note) {
                id
            }
        }
    `)

    return { updateTransaction, onDone, onError }
}

export default getUpdateTransaction