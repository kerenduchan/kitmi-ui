import Subcategory from './Subcategory'
import Payee from './Payee'
import { formatNumber, formatDate } from '@/composables/utils'

// Represents one transaction. 
// Wraps the transaction received from the server and exposes useful UI-specific 
// getters on it.

class Transaction {

    constructor(params) {
        this.id = params.id
        this.date = params.date
        this.amount = params.amount
        this.accountId = params.accountId
        this.overrideSubcategory = params.overrideSubcategory
        this.note = params.note
        this.payeeId = params.payeeId

        // nested objects (optional)
        this.payee = null
        this.account = null
        this.overridingSubcategory = null
    }

    static fromGql(gqlObj) {
        let obj = new Transaction({
            id: gqlObj.id,
            date: new Date(gqlObj.date),
            amount: gqlObj.amount,
            accountId: gqlObj.accountId,
            overrideSubcategory: gqlObj.overrideSubcategory,
            note: gqlObj.note,
            payeeId: gqlObj.payeeId
        })

        obj.account = gqlObj.account

        if(gqlObj.overrideSubcategory && gqlObj.subcategoryId !== null) {
            obj.overridingSubcategory = Subcategory.fromGql(gqlObj.subcategory)
        }

        if(gqlObj.payee) {
            this.payee = Payee.fromGql(gqlObj.payee)
        }

        if (gqlObj.transactions) {
            obj.transactions = gqlObj.transactions.map(t => Transaction.fromGql(t))
        }
        return obj
    }

    get subcategory() {
        // The actual subcategory for the transaction - 
        // either the payee's subcategory or the overriding subcategory
        return this.overrideSubcategory ? this.overridingSubcategory : this.payee.subcategory;
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

    get formattedAmount() {
        return formatNumber(this.amount)
    }

    get formattedDate() {
        return formatDate(this.date)
    }

    get isCategorized() {
        return this.subcategory !== null
    }

    get isExpense() {
        if(this.category) {
            return this.category.isExpense
        }
        return this.amount <= 0
    }

    get type() {
        if(this.amount > 0) {
            return 'Income'
        }
        if(this.amount < 0) {
            return 'Expense'
        }
        // t.amount === 0
        return 'Zero'
    }

    get excludeFromReports() {
        return this.subcategory === null || this.category.excludeFromReports
    }

    get payeeCategorizationStr() {
        if(!this.payee.subcategory) {
            return 'Uncategorized'
        }
        return this.payee.categoryName + ': ' + this.payee.subcategoryName
    
    }
}

export default Transaction