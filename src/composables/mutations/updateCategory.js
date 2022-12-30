import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

function getUpdateCategory() {
    // gql mutation for updating a category
    const { mutate: updateCategory, onDone, onError } = useMutation(gql`
        mutation updateCategory ($categoryId: ID!,
                                 $name: String!, 
                                 $isExpense: Boolean!, 
                                 $excludeFromReports: Boolean!) {
            updateCategory (categoryId: $categoryId, 
                            name: $name, 
                            isExpense: $isExpense, 
                            excludeFromReports: $excludeFromReports) {
                id
                name
            }
        }
    `)

    return { updateCategory, onDone, onError }
}

export default getUpdateCategory