<script setup>
import { ref, computed } from 'vue'
import ExpenseOrIncomeRadioGroup from './ExpenseOrIncomeRadioGroup.vue'
import expenseOrIncome from '@/composables/expenseOrIncome'
import { isReservedName } from '@/composables/utils'

// props 
const props = defineProps({
    // category is null for create or an object for edit
    category: Object,
    categories: Object
})

const emit = defineEmits([
    'close',
    'save'
])

// v-model for name
const name = ref(props.category ? props.category.name : '')

// v-model for type (expense/income)
const { isExpense, handleTypeChange} = 
    expenseOrIncome(props.category ? props.category.isExpense : true)

// v-model for "Exclude from reports" checkbox
const excludeFromReports = ref(props.category ? props.category.excludeFromReports : false)

const isNameAlreadyExists = computed(() => {
    if(props.category && name.value == props.category.name) {
        return false
    }
    return (props.categories.find(c => c.name == name.value) !== undefined)
})

const isSaveDisabled = computed(() => {
    return name.value.length === 0 || 
    isNameAlreadyExists.value === true ||
    isReservedName(name.value)
})

const title = computed(() => {
    if(props.category) {
        return "Edit Category '" + props.category.name + "'"
    }
    return "Create Category"
})

function save() {
    const category = { 
        name: name.value,
        isExpense: isExpense.value,
        excludeFromReports: excludeFromReports.value
    }
    if(props.category) {
        // for update
        category.categoryId = props.category.id
    }
    emit('save', category)
}

</script>

<template>
    <v-card>
        <v-card-title>{{ title }}</v-card-title>
        <v-card-text>
            <v-form>
                <!-- Name -->
                <v-text-field 
                    label="Name" 
                    v-model="name" 
                    :rules="[ 
                        n => n.length > 0 || 'Name must not be empty',
                        n => !isNameAlreadyExists || 'Name already used',
                        n => !isReservedName(n) || 'This is a reserved name'
                        ]" />

                <!-- Type -->
                <ExpenseOrIncomeRadioGroup 
                    :isExpense="isExpense" 
                    @change="handleTypeChange"/>

                <!-- Exclude from reports -->
                <v-checkbox label="Exclude from reports" v-model="excludeFromReports" />
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" :disabled="isSaveDisabled" @click="save">Save</v-btn>
            <v-btn color="primary" @click="emit('close')">Close</v-btn>
            
        </v-card-actions>
    </v-card>
</template>