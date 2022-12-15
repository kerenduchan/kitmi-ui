import YearlySummaryRow from './YearlySummaryRow'

class YearlySummary {

    constructor(gqlYearlySummary) {
        this.year = gqlYearlySummary.year
        this.expenseRows = []
        this.incomeRows = []

        gqlYearlySummary.rows.forEach(r => {
            const row = new YearlySummaryRow(r)
            if (r.subcategory.category.isExpense) {
                this.expenseRows.push(row)
            } else {
                this.incomeRows.push(row)
            }
        })
    }
}

export default YearlySummary