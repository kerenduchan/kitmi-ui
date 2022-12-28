<script setup>
import { ref, computed } from 'vue'
import ExpenseOrIncomeRadioGroup from './ExpenseOrIncomeRadioGroup.vue';

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

// v-models for form fields
const name = ref(props.category ? props.category.name : '')
const isExpense = ref(props.category ? props.category.isExpense : true)

const isNameAlreadyExists = computed(() => {
    if(props.category && name.value == props.category.name) {
        return false
    }
    return (props.categories.find(c => c.name == name.value) !== undefined)
})

const isSaveDisabled = computed(() => {
    return name.value.length === 0 || isNameAlreadyExists.value === true
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
        isExpense: isExpense.value
    }
    if(props.category) {
        // for update
        category.categoryId = props.category.id
    }
    emit('save', category)
}

function handleTypeChange(value) {
    isExpense.value = value
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
                        n => !isNameAlreadyExists || 'Name already used'
                        ]" />

                <!-- Type -->
                <ExpenseOrIncomeRadioGroup :isExpense="isExpense" @change="handleTypeChange"/>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" :disabled="isSaveDisabled" @click="save">Save</v-btn>
            <v-btn color="primary" @click="emit('close')">Close</v-btn>
            
        </v-card-actions>
    </v-card>
</template>