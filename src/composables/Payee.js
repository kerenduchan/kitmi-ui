

// Represents one payee. 
// Wraps the payee received from the server and exposes useful UI-specific 
// getters on it.

class Payee {
    constructor(gqlPayee) {
        this.gqlPayee = gqlPayee;
    }

    get name() {
        return this.gqlPayee.name
    }

    get categoryName() {
        if(this.gqlPayee.subcategory) {
            return this.gqlPayee.subcategory.category.name
        } 
        return ''
    }

    get subcategoryName() {
        if(this.gqlPayee.subcategory) {
            return this.gqlPayee.subcategory.name
        } 
        return ''
    }

    get type() {
        if(this.gqlPayee.subcategory === null) {
            return ''
        }
        return this.gqlPayee.subcategory.category.isExpense ? "Expense" : "Income"
    }
}

export default Payee