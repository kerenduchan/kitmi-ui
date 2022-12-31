import Subcategory from "./Subcategory"

// Represents one category and its subcategories. 
// Wraps the category received from the server and exposes useful UI-specific 
// getters on it.

class Category {
    constructor(gqlCategory) {
        this.id = gqlCategory.id
        this.name = gqlCategory.name
        this.isExpense = gqlCategory.isExpense
        this.excludeFromReports = gqlCategory.excludeFromReports
        this.subcategories = null
        if (gqlCategory.subcategories)
            this.subcategories = gqlCategory.subcategories.map(s => new Subcategory(s))
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