import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

function getCreateCategory() {
    // gql mutation for creating a category
    const { mutate: createCategory, onDone, onError } = useMutation(gql`
        mutation createCategory ($name: String!, 
                                 $isExpense: Boolean!, 
                                 $excludeFromReports: Boolean!) {
            createCategory (name: $name, 
                            isExpense: $isExpense, 
                            excludeFromReports: $excludeFromReports) {
                id
                name
            }
        }
    `)

    return { createCategory, onDone, onError }
}

export default getCreateCategory