import { ref } from 'vue'

// for the ExpenseOrIncomeRadioGroup component
function expenseOrIncome(v) {

    const isExpense = ref(v)
    function handleTypeChange(value) {
        isExpense.value = value
    }
    
    return {
        isExpense, 
        handleTypeChange
    }
}

export default expenseOrIncome