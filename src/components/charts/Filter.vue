<script setup>
import { ref, computed } from 'vue'
import moment from 'moment'
import ExpenseOrIncomeRadioGroup from '../ExpenseOrIncomeRadioGroup.vue'
import expenseOrIncome from '@/composables/expenseOrIncome'

const props = defineProps({
    defaults: Object
})

const emit = defineEmits([
    'close',
    'filter'
])

// start date (v-model for input)
const startDate = ref(props.defaults.startDate)

// end date (v-model for input)
const endDate = ref(props.defaults.endDate)

// group by category/subcategory = v-model for the v-select
const groupBy = ref(props.defaults.groupBy)

// for the type (expense/income)
const { isExpense, handleTypeChange} = 
    expenseOrIncome(props.defaults.isExpense)

const startDateError = computed(() => {
    if (!isValidDate(startDate.value)) {
        return 'Invalid start date.'
    }
    return ''
})

const endDateError = computed(() => {
    if (!isValidDate(endDate.value)) {
        return 'Invalid end date.'
    }
    if (isValidDate(startDate.value)) {
        const count = countMonths()
        if(count < 0 || count > 12)
            return 'Date range should be 1-12 months'
    }
    return ''
})

function isValidDate(str) {
    const d = new Date(str)
    return moment(str, "YYYY-MM-DD", true).isValid() && (d.getFullYear() > 2010)
}

function countMonths() {
    const start = new Date(startDate.value)
    const end = new Date(endDate.value)

    return (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth()
}

const isFilterDisabled = computed(() => {
    return startDateError.value.length > 0 || endDateError.value.length > 0
})
function handleFilterClicked() {
    emit('filter', {
        startDate: startDate.value,
        endDate: endDate.value,
        groupBy: groupBy.value,
        isExpense: isExpense.value
    })
}

</script>

<template>
    <v-card>
        <v-card-title>Filter</v-card-title>
        <v-card-text>
            <form>
                <!-- Start date -->
                <div>
                    <label for="start">Start date:</label>
                    <input type="date" id="start" v-model="startDate">
                    {{ startDateError }}
                </div>

                <!-- End date -->
                <div>
                    <label for="end">End date:</label>
                    <input type="date" id="end" v-model="endDate">
                    {{ endDateError }}
                </div>

                <!-- Group by category/subcategory -->
                <v-select label="Group By" :items="['category', 'subcategory']" v-model="groupBy" />

                <!-- Type (expense/income)-->
                <ExpenseOrIncomeRadioGroup 
                    :isExpense="isExpense" 
                    @change="handleTypeChange"/>

            </form>

        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" :disabled="isFilterDisabled" @click="handleFilterClicked">Filter</v-btn>
            <v-btn color="primary" @click="emit('close')">Close</v-btn>
        </v-card-actions>
    </v-card>
</template>