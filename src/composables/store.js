
import getAccounts from '@/composables/queries/getAccounts'
import getCategories from '@/composables/queries/getCategories'
import getPayees from '@/composables/queries/getPayees'

let theStore = null

class Store {
    constructor() {
        this.refetchers = {}
    }

    fetchAccounts() {
        const { accounts, isReady, refetch } = getAccounts() 
        this.accounts = accounts
        this.refetchers.refetchAccounts = refetch
        return { isReady }
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

    refetchAccounts() {
        this.refetchers.refetchAccounts()
    }

    refetchCategories() {
        // a category/subcategory change means we need to refetch
        // transactions and payees as well.
        this.refetchers.refetchCategories()
        this.refetchers.refetchPayees()
    }

    refetchPayees() {
        // a payee change means we need to refetch
        // transactions as well.
        this.refetchers.refetchPayees()
    }

    getTransactionsForPayeeId(payeeId) {
        const res = this.transactions.value.filter(t => t.payee.id === payeeId)
        return res
    }
}

function getStore() {

    if(theStore === null) {
        theStore = new Store()
    }
    return theStore
}

export default getStore