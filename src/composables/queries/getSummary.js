import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { ref } from 'vue'

function getSummary(vars) {
    const { onResult, refetch } = useQuery(gql`
        query getSummary(
            $groupBy: String!, 
            $startDate: Date!, 
            $endDate: Date!, 
            $isExpense: Boolean!, 
            $mergeUnderThreshold: Boolean!) {
            summary(
                startDate: $startDate, 
                endDate: $endDate, 
                groupBy: $groupBy, 
                isExpense: $isExpense, 
                mergeUnderThreshold: $mergeUnderThreshold) {
                buckets,
                groups {
                    groupId
                    name
                    data
                    total
                }
                totals
            }
        }
    `, vars)

    return { onResult, refetch }
}

export default getSummary



