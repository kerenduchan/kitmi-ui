import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { ref } from 'vue'

function getSummary(vars) {
    const { onResult, refetch } = useQuery(gql`
        query getSummary($groupBy: String!, $startDate: Date!, $endDate: Date!) {
            summary(groupBy: $groupBy, startDate: $startDate, endDate: $endDate) {
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



