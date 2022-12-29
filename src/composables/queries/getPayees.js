import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { ref } from 'vue'
import Payee from '@/composables/model/Payee'

function getPayees() {
    const { onResult, refetch } = useQuery(gql`
        query getPayees {
            payees {
                id
                name
                subcategoryId
                ignore
                subcategory {
                    id
                    name
                    category {
                        id
                        name
                        isExpense
                    }
                }
            }
        }
    `)

    const payees = ref(null)
    const isReady = ref(false)

    onResult(queryResult => {
        payees.value = queryResult.data.payees.map((p) => new Payee(p))
        isReady.value = true
    })

    return { payees, isReady, refetch }
}

export default getPayees