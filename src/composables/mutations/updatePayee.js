import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

function getUpdatePayee() {
    // gql mutation for updating the subcategory of a payee
    const { mutate: updatePayee, onDone, onError } = useMutation(gql`
        mutation updatePayee ($payeeId: ID!, $subcategoryId: ID, $ignore: Boolean) {
            updatePayee (payeeId: $payeeId, subcategoryId: $subcategoryId, ignore: $ignore) {
                id
            }
        }
    `)

    return { updatePayee, onDone, onError }
}

export default getUpdatePayee