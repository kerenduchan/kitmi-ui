import Subcategory from './Subcategory'
import { formatNumber } from '@/composables/utils'

class YearlySummaryRow {

    constructor(gqlYearlySummaryRow) {
        this.subcategory = new Subcategory(gqlYearlySummaryRow.subcategory)
        this.monthlySums = gqlYearlySummaryRow.monthlySums
        this.totalSum = gqlYearlySummaryRow.totalSum
    }

    get formattedTotalSum() {
        return formatNumber(this.totalSum)        
  }

}

export default YearlySummaryRow