import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { ref } from 'vue'

function getBalanceSummary(vars) {
    const { onResult, refetch } = useQuery(gql`
        query getBalanceSummary(
            $startDate: Date!, 
            $endDate: Date!, 
            $groupBy: SummaryGroupBy!) {
            balanceSummary(
                startDate: $startDate, 
                endDate: $endDate, 
                groupBy: $groupBy) {
                    income {
                        buckets,
                        groups {
                            groupId
                            name
                            data
                            total
                        }
                        bucketTotals
                        sumTotal        
                    },
                    expenses {
                        buckets,
                        groups {
                            groupId
                            name
                            data
                            total
                        }
                        bucketTotals
                        sumTotal        
                    },
                }
            }
    `, vars)

    return { onResult, refetch }
}

export default getBalanceSummary



