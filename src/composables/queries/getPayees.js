import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { ref } from 'vue'
import Payee from '@/composables/model/Payee'

function getPayees() {
    const { onResult, refetch } = useQuery(gql`
        query getPayees {
            payees {
                items {
                    id
                    name
                    subcategoryId
                    note
                    subcategory {
                        id
                        name
                        category {
                            id
                            name
                            isExpense
                            excludeFromReports
                        }
                    }    
                }
            }
        }
    `)

    const payees = ref(null)
    const totalItemsCount = ref(null)

    onResult(queryResult => {
        const data = queryResult.data.payees
        payees.value = data.items.map((p) => new Payee(p))
        totalItemsCount.value = data.totalItemsCount
    })

    return { payees, refetch }
}

export default getPayees