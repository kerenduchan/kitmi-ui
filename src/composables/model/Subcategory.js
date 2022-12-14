import Category from "./Category"

class Subcategory {

    constructor(gqlSubcategory) {
        this.id = gqlSubcategory.id
        this.name = gqlSubcategory.name
        this.category = gqlSubcategory.category ? new Category(gqlSubcategory.category) : null
    }

    get type() {
        return this.category ? this.category.type : ''
    }

    get categoryName() {
        return this.category ? this.category.name : ''
    }

}

export default Subcategory