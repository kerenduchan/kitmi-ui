
import getCategories from '@/composables/queries/getCategories'
import getPayees from '@/composables/queries/getPayees'
import getTransactions from '@/composables/queries/getTransactions'

let theStore = null

class Store {
    constructor() {
        this.refetchers = {}
    }

    fetchCategories() {
        const { categories, isReady, refetch } = getCategories() 
        this.categories = categories
        this.refetchers.refetchCategories = refetch
        return { isReady }
    }

    fetchPayees() {
        const { payees, isReady, refetch } = getPayees() 
        this.payees = payees
        this.refetchers.refetchPayees = refetch
        return { isReady }
    }

    fetchTransactions() {
        const { transactions, isReady, refetch } = getTransactions() 
        this.transactions = transactions
        this.refetchers.refetchTransactions = refetch
        return { isReady }
    }

    refetchCategories() {
        // a category/subcategory change means we need to refetch
        // transactions and payees as well.
        this.refetchers.refetchCategories()
        this.refetchers.refetchPayees()
        this.refetchers.refetchTransactions()
    }

    refetchPayees() {
        // a payee change means we need to refetch
        // transactions as well.
        this.refetchers.refetchPayees()
        this.refetchers.refetchTransactions()
    }

    refetchTransactions() {
        this.refetchers.refetchTransactions()
    }

}

function getStore() {

    if(theStore === null) {
        theStore = new Store()
    }
    return theStore
}

export default getStore