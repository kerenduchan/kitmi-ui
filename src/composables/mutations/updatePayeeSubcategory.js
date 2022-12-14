import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

function updatePayeeSubcategory() {
    // gql mutation for updating the subcategory of a payee
    const { mutate: gqlUpdatePayeeSubcategory, onDone, onError } = useMutation(gql`
        mutation updatePayeeSubcategory ($payeeId: ID!, $subcategoryId: ID!) {
            updatePayeeSubcategory (payeeId: $payeeId, subcategoryId: $subcategoryId) {
                id
            }
        }
    `)

    return { gqlUpdatePayeeSubcategory, onDone, onError }
}

export default updatePayeeSubcategory