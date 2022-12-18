import Category from "./Category"

class Subcategory {

    constructor(gqlSubcategory) {
        this.id = gqlSubcategory.id
        this.name = gqlSubcategory.name
        this.categoryId = gqlSubcategory.categoryId
        this.category = gqlSubcategory.category ? new Category(gqlSubcategory.category) : null
    }

    get type() {
        return this.category ? this.category.type : ''
    }

    get categoryName() {
        return this.category ? this.category.name : ''
    }

    get objClass() {
        return 'Subcategory'
    }

    get key() {
        // key is unique across all object types (category, subcategory etc)
        return 's' + this.id
    }
}

export default Subcategory