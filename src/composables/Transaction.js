

// Represents one transaction. 
// Wraps the transaction received from the server and exposes useful UI-specific 
// getters on it.

class Transaction {
    constructor(gqlTransaction) {
        this.gqlTransaction = gqlTransaction;
    }

    get date() {
        return this.gqlTransaction.date
    }

    get amount() {
        return this.gqlTransaction.date
    }

    get payeeName() {
        return this.gqlTransaction.payee.name
    }

    get subcategory() {
        // the subcategory of the transaction overrides the subcategory
        // of the payee of the transaction
        const t = this.gqlTransaction
        if (t.subcategory) {
            return t.subcategory
        }
        return t.payee.subcategory
    }
    
    get category() {
        const s = this.subcategory
        return s ? s.category : null
    }

    get subcategoryName() {
        const s = this.subcategory
        return s ? s.name : ''
    }

    get categoryName() {
        const c = this.category
        return c ? c.name : ''
    }

    get type() {
        const c = this.category
        if(c === null) {
            return ''
        }
        return c.isExpense ? "Expense" : "Income"
    }
}

export default Transaction