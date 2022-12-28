import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { ref } from 'vue'

function getSummary(vars) {
    const { onResult, refetch } = useQuery(gql`
        query getSummary($groupBy: String!, $startDate: Date!, $endDate: Date!, $isExpense: Boolean) {
            summary(startDate: $startDate, endDate: $endDate, groupBy: $groupBy, isExpense: $isExpense) {
                xAxis,
                    groups {
                    groupId
                    name
                    data
                }
            }
        }
    `, vars)

    return { onResult, refetch }
}

export default getSummary



