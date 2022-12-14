

// Represents one payee. 
// Wraps the payee received from the server and exposes useful UI-specific 
// getters on it.

import Subcategory from "./Subcategory";

class Payee {
    constructor(gqlPayee) {
        this.id = gqlPayee.id
        this.name = gqlPayee.name
        this.subcategory = gqlPayee.subcategory ? new Subcategory(gqlPayee.subcategory) : null
    }

    get categoryName() {
        return this.subcategory ? this.subcategory.categoryName : ''
    }

    get subcategoryName() {
        return this.subcategory ? this.subcategory.name : ''
    }

    get type() {
        return this.subcategory ? this.subcategory.type : ''
    }
}

export default Payee