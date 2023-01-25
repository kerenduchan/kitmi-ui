

// Represents one payee. 
// Wraps the payee received from the server and exposes useful UI-specific 
// getters on it.

import Subcategory from "./Subcategory"
import Transaction from "./Transaction"

class Payee {
    constructor(gqlPayee) {
        this.id = gqlPayee.id
        this.name = gqlPayee.name
        this.note = gqlPayee.note
        this.subcategory = gqlPayee.subcategory ? new Subcategory(gqlPayee.subcategory) : null
        this.transactions = gqlPayee.transactions ? gqlPayee.transactions.map(t => new Transaction(t)) : null
    }

    get category() {
        return this.subcategory ? this.subcategory.category : null
    }

    get categoryName() {
        return this.subcategory ? this.subcategory.categoryName : ''
    }

    get categoryId() {
        return this.category ? this.category.id : null
    }

    get subcategoryName() {
        return this.subcategory ? this.subcategory.name : ''
    }

    get subcategoryId() {
        return this.subcategory ? this.subcategory.id : null
    }

    get type() {
        return this.subcategory ? this.subcategory.type : 'Undefined'
    }

    get isCategorized() {
        return this.subcategory !== null
    }

    get excludeFromReports() {
        return this.subcategory === null || this.category.excludeFromReports
    }
}

export default Payee