

// Represents one category and its subcategories. 
// Wraps the category received from the server and exposes useful UI-specific 
// getters on it.

class Category {
    constructor(gqlCategory) {
        this.gqlCategory = gqlCategory
    }

    get id() {
        return this.gqlCategory.id
    }
    get name() {
        return this.gqlCategory.name
    }

    get type() {
        return  this.gqlCategory.isExpense ? 'Expense' : 'Income'
    }

    get subcategories() {
        return this.gqlCategory.subcategories
    }
}

export default Category