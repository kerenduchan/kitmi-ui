

// Represents one payee. 
// Wraps the payee received from the server and exposes useful UI-specific 
// getters on it.

import Subcategory from "./Subcategory"
import Transaction from "./Transaction"

class Payee {

    constructor(id, name, note) {
        this.id = id
        this.name = name
        this.note = note

        // nested objects (optional)
        this.subcategory = null
        this.transactions = null
    }

    static fromGql(gqlObj) {
        let obj = new Payee(gqlObj.id, gqlObj.name, gqlObj.note)
        if (gqlObj.subcategory) {
            obj.subcategory = Subcategory.fromGql(gqlObj.subcategory)
        }
        if (gqlObj.transactions) {
            obj.transactions = gqlObj.transactions.map(t => Transaction.fromGql(t))
        }
        return obj
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