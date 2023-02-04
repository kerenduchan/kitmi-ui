import Subcategory from "./Subcategory"

// Represents one category and its subcategories. 
// Wraps the category received from the server and exposes useful UI-specific 
// getters on it.

class Category {

    constructor(id, name, isExpense, excludeFromReports) {
        this.id = id
        this.name = name
        this.isExpense = isExpense
        this.excludeFromReports = excludeFromReports

        // nested objects (optional)
        this.subcategories = null
    }

    static fromGql(gqlObj) {
        let obj = new Category(gqlObj.id, gqlObj.name, gqlObj.isExpense, gqlObj.excludeFromReports)
        if (gqlObj.subcategories) {
            obj.subcategories = gqlObj.subcategories.map(s => Subcategory.fromGql(s))
        }
        return obj
    }

    get type() {
        return this.isExpense ? 'Expense' : 'Income'
    }

    get hasSubcategories() {
        return this.subcategories && this.subcategories.length > 0
    }

    get objClass() {
        return 'Category'
    }

    get key() {
        // key is unique across all object types (category, subcategory etc)
        return 'c' + this.id
    }
}

export default Category