
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

    refetchAccounts() {
        this.refetchers.refetchAccounts()
    }

    refetchCategories() {
        this.refetchers.refetchCategories()
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