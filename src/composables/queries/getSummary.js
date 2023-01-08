import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { ref } from 'vue'

function getSummary(vars) {
    const { onResult, refetch } = useQuery(gql`
        query getSummary(
            $startDate: Date!, 
            $endDate: Date!, 
            $options: SummaryOptions!) {
            summary(
                startDate: $startDate, 
                endDate: $endDate, 
                options: $options) {
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



