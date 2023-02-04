import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

function getUpdatePayees() {
    // gql mutation for updating the subcategory of several payees
    const { mutate: updatePayees, onDone, onError } = useMutation(gql`
    mutation updatePayees($payees: [UpdatePayeeInput!]!) {
        updatePayees(payees: $payees)
      }
    `)

    return { updatePayees, onDone, onError }
}

export default getUpdatePayees