import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { ref } from 'vue'
import YearlySummary from '@/composables/model/YearlySummary'

function getYearlySummary(year) {
    const { onResult, refetch } = useQuery(gql`
        query getYearlySummary($year: Int!) {
            yearlySummary(year: $year) {
                year
                rows {
                    subcategory {
                        id
                        name
                        category {
                            id
                            name
                            isExpense
                        }
                    }
                    monthlySums
                    totalSum
                }
            }
        }
    `,
    {
        year
    }
    )

    const summary = ref(null)
    const isReady = ref(false)

    onResult(queryResult => {
        summary.value = new YearlySummary(queryResult.data.yearlySummary)
        isReady.value = true
    })

    return { summary, isReady, refetch }
}

export default getYearlySummary