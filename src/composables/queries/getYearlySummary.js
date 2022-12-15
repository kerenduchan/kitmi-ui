import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { ref } from 'vue'
import YearlySummary from '@/composables/model/YearlySummary'

function getYearlySummary() {
    const { onResult, refetch } = useQuery(gql`
    query getYearlySummary {
        yearlySummary(year: 2020) {
        year
        incomeRows {
          categoryId
          subcategoryId
          monthlySums
          totalSum
        }
        expenseRows {
          categoryId
          subcategoryId
          monthlySums
          totalSum      
        }
      }
    }
    `)

    const summary = ref(null)
    const isReady = ref(false)

    onResult(queryResult => {
        summary.value = new YearlySummary(queryResult.data.yearlySummary)
        console.log(summary.value)
        isReady.value = true
    })

    return { summary, isReady, refetch }
}

export default getYearlySummary