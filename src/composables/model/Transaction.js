

import Subcategory from './Subcategory'
import Payee from './Payee'
import Account from './Account'

// Represents one transaction. 
// Wraps the transaction received from the server and exposes useful UI-specific 
// getters on it.

class Transaction {

    constructor(gqlTransaction) {
        this.date = gqlTransaction.date
        this.amount = gqlTransaction.amount
        this.payee = new Payee(gqlTransaction.payee)
        this.account = new Account(gqlTransaction.account)
        this.#initSubcategory(gqlTransaction)
    }

    #initSubcategory(gqlTransaction) {
        // the subcategory of the transaction overrides the subcategory
        // of the payee of the transaction
        if(gqlTransaction.subcategory) {
            this.subcategory = new Subcategory(gqlTransaction.subcategory)
        } else {
            // assumes this.payee has already been initialized
            this.subcategory = this.payee.subcategory;
        }
    }

    get payeeName() {
        return this.payee.name
    }

    get subcategoryName() {
        return this.subcategory ? this.subcategory.name : ''
    }

    get categoryName() {
        return this.subcategory ? this.subcategory.categoryName : ''
    }

    get type() {
        return this.subcategory ? this.subcategory.type : ''
    }
}

export default Transaction