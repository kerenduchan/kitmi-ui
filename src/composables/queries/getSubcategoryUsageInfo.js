import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { ref } from 'vue'
import SubcategoryUsageInfo from '@/composables/model/SubcategoryUsageInfo'

function getSubcategoryUsageInfo(subcategoryId) {
    const { onResult, refetch } = useQuery(gql`
        query getSubcategoryUsageInfo($subcategoryId: ID!) {
            subcategoryUsageInfo(subcategoryId: $subcategoryId) {
                isUsed
            }
        }
    `, { subcategoryId }
    )

    const info = ref(null)
    const isReady = ref(false)

    onResult(queryResult => {
        console.log('got result')
        console.log(queryResult.data.subcategoryUsageInfo)
        info.value = new SubcategoryUsageInfo(queryResult.data.subcategoryUsageInfo)
        isReady.value = true
    })

    return { info, isReady, refetch }
}

export default getSubcategoryUsageInfo