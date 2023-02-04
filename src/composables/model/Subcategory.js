import Category from "./Category"

class Subcategory {

    constructor(id, name, categoryId) {
        this.id = id
        this.name = name
        this.categoryId = categoryId

        // nested objects (optional)
        this.category = null
    }

    static fromGql(gqlObj) {
        let obj = new Subcategory(gqlObj.id, gqlObj.name, gqlObj.categoryId)
        if(gqlObj.category) {
            obj.category = Category.fromGql(gqlObj.category)
        }
        return obj
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