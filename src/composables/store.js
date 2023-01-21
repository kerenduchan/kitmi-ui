
import getAccounts from '@/composables/queries/getAccounts'
import getCategories from '@/composables/queries/getCategories'
import getPayees from '@/composables/queries/getPayees'

let theStore = null

class Store {
    constructor() {
        this.refetchers = {}
    }

    fetchAccounts() {
        const { accounts, refetch } = getAccounts() 
        this.accounts = accounts
        this.refetchers.refetchAccounts = refetch
    }

    fetchCategories() {
        const { categories, refetch } = getCategories() 
        this.categories = categories
        this.refetchers.refetchCategories = refetch
    }

    fetchPayees() {
        const { payees, refetch } = getPayees() 
        this.payees = payees
        this.refetchers.refetchPayees = refetch
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