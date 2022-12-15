class YearlySummaryRow {
    constructor(gqlYearlySummaryRow) {
        this.categoryId = gqlYearlySummaryRow.categoryId
        this.subcategoryId = gqlYearlySummaryRow.subcategoryId
        this.monthlySums = gqlYearlySummaryRow.monthlySums
        this.totalSum = gqlYearlySummaryRow.totalSum
    }
}

export default YearlySummaryRow