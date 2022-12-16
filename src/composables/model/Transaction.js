import Subcategory from './Subcategory'
import Payee from './Payee'
import Account from './Account'
import { formatNumber, formatDate } from '@/composables/utils'

// Represents one transaction. 
// Wraps the transaction received from the server and exposes useful UI-specific 
// getters on it.

class Transaction {

    constructor(gqlTransaction) {
        this.id = gqlTransaction.id
        this.date = new Date(gqlTransaction.date)
        this.amount = gqlTransaction.amount
        this.payee = new Payee(gqlTransaction.payee)
        this.account = new Account(gqlTransaction.account)

        this.overridingSubcategory = gqlTransaction.subcategory ?
            new Subcategory(gqlTransaction.subcategory) :
            null

        // The actual subcategory for the transaction - 
        // either the payee's subcategory or the overriding subcategory
        this.subcategory = this.overridingSubcategory ?
            this.overridingSubcategory :
            this.payee.subcategory;
    }

    get payeeName() {
        return this.payee.name
    }

    get subcategoryName() {
        return this.subcategory ? this.subcategory.name : ''
    }

    get category() {
        return this.subcategory ? this.subcategory.category : null
    }

    get categoryName() {
        return this.category ? this.category.name : ''
    }

    get categoryId() {
        return this.category ? this.category.id : null
    }

    get subcategoryId() {
        return this.subcategory ? this.subcategory.id : null
    }

    get type() {
        return this.subcategory ? this.subcategory.type : ''
    }

    get formattedAmount() {
        return formatNumber(this.amount)
    }

    get formattedDate() {
        return formatDate(this.date)
    }

    get isCategorized() {
        return this.subcategory !== null
    }
}

export default Transaction