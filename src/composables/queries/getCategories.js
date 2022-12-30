import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { ref } from 'vue'
import Category from '@/composables/model/Category'

function getCategories() {
    const { onResult, refetch } = useQuery(gql`
        query getCategories {
            categories {
                id
                name
                isExpense
                excludeFromReports
                subcategories {
                    id
                    name
                    categoryId
                }
            }
        }
    `)

    const categories = ref(null)
    const isReady = ref(false)

    onResult(queryResult => {
        categories.value = queryResult.data.categories.map((p) => new Category(p))
        isReady.value = true
    })

    return { categories, isReady, refetch }
}

export default getCategories