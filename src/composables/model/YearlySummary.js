import YearlySummaryRow from './YearlySummaryRow'

class YearlySummary {
    constructor(gqlYearlySummary) {
        this.year = gqlYearlySummary.year
        this.incomeRows = gqlYearlySummary.incomeRows.map(r => new YearlySummaryRow(r))
        this.expenseRows = gqlYearlySummary.expenseRows.map(r => new YearlySummaryRow(r))
    }
}

export default YearlySummary