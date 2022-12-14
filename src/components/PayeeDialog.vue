<script setup>
import { ref, computed, watchEffect } from 'vue'
import updatePayeeSubcategory from '@/composables/mutations/updatePayeeSubcategory'

// props 
const props = defineProps({
    payee: Object,
    categories: Object
})

const emit = defineEmits([
    'close',
    'change'
])

const { 
    gqlUpdatePayeeSubcategory, 
    onDone: onUpdatePayeeDone, 
    onError: onUpdatePayeeError 
} = updatePayeeSubcategory()

// The selected type (Income/Expense)  (v-model for the radio group element)
const type = ref(props.payee.type ? props.payee.type : 'Expense')

// The selected category ID (v-model for the v-select element)
const categoryId = ref(props.payee.categoryId)

// The selected subcategory ID (v-model for the select element)
const subcategoryId = ref(props.payee.subcategoryId)

// The list of possible categories shown in the select.
// Depends on the selected type (Income/Expense).
// Also, filter out categories with no subcategories.
const categories = computed(() => {
    const isExpense = (type.value === 'Expense')
    return props.categories.filter(c => c.isExpense === isExpense && c.hasSubcategories)
})

// The list of possible subcategories shown in the select.
// Depends on the selected category.
const subcategories = ref([])


function findCategoryById(id) {
    let c = null
    if(id !== null) {
        c = categories.value.find(c => c.id === id)
    }
    return c
}

function findSubcategoryById(id) {
    let s = null
    if(id !== null) {
        s = subcategories.value.find(s => s.id === id)
    }
    return s
}

// handle a change in categories, and also run intially.
// this will happen as a result of type change (Income/Expense)
watchEffect(() => {
    const c = findCategoryById(props.payee.categoryId)
    if(c) {
        // The payee's categoryId appears in the list of categories
        categoryId.value = props.payee.categoryId
    } else {
        categoryId.value = null
    }
})

// handle a change in the selected categoryId
watchEffect(() => {
    if(categoryId.value === null) {
        // No category is selected. Clear subcategoryId and subcategories.
        subcategoryId.value = null
        subcategories.value = []
    } else {
        // A category is selected. Set subcategories accordingly.
        const c = findCategoryById(categoryId.value)
        if(c === null) {
            return
        }
        subcategories.value = c.subcategories

        // And set subcategoryId accordingly.
        const s = findSubcategoryById(props.payee.subcategoryId)
        subcategoryId.value = s ? props.payee.subcategoryId : null
    }
})

const isSaveDisabled = computed(() => {
    return (categoryId === null || subcategoryId.value === null)
})

function save() {
    console.log('save')
    gqlUpdatePayeeSubcategory({
        payeeId: props.payee.id, 
        subcategoryId: subcategoryId.value
    })
}

onUpdatePayeeDone(() => {
    emit('change')
})

onUpdatePayeeError((e) => {
    console.error('failed to update payee')
    console.error(e)
})

function close() {
    emit('close')
}

</script>

<template>
    <v-card>
        <v-card-title>{{ props.payee.name }}</v-card-title>
        <v-card-text>
            <v-form>
                <v-radio-group label="Type" v-model="type">
                    <v-radio label="Expense" value="Expense"></v-radio>
                    <v-radio label="Income" value="Income"></v-radio>
                </v-radio-group>

                <v-select 
                    label="Category" 
                    :items="categories" 
                    item-title="name" 
                    item-value="id" 
                    v-model="categoryId"
                />

                <v-select 
                    label="Subcategory" 
                    :items="subcategories" 
                    item-title="name" 
                    item-value="id" 
                    v-model="subcategoryId"/>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" :disabled="isSaveDisabled" @click="save">Save</v-btn>
            <v-btn color="primary" @click="close">Close</v-btn>
            
        </v-card-actions>
    </v-card>
</template>