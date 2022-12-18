
import getCategories from '@/composables/queries/getCategories'
import getPayees from '@/composables/queries/getPayees'
import getTransactions from '@/composables/queries/getTransactions'

let theStore = null

class Store {
    fetchCategories() {
        const { categories, isReady, refetch } = getCategories() 
        this.categories = categories
        this.refetchCategories = refetch
        return { isReady }
    }

    fetchPayees() {
        const { payees, isReady, refetch } = getPayees() 
        this.payees = payees
        this.refetchPayees = refetch
        return { isReady }
    }

    fetchTransactions() {
        const { transactions, isReady, refetch } = getTransactions() 
        this.transactions = transactions
        this.refetchTransactions = refetch
        return { isReady }
    }
}

function getStore() {

    if(theStore === null) {
        theStore = new Store()
    }
    return theStore
}

export default getStore