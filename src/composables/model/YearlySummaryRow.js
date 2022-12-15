import Category from './Category'
import Subcategory from './Subcategory'

class YearlySummaryRow {
    constructor(gqlYearlySummaryRow) {
        this.category = new Category(gqlYearlySummaryRow.category)
        this.subcategory = new Subcategory(gqlYearlySummaryRow.subcategory)
        this.monthlySums = gqlYearlySummaryRow.monthlySums
        this.totalSum = gqlYearlySummaryRow.totalSum
    }
}

export default YearlySummaryRow