<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'

// props 
const props = defineProps({
    payee: Object,
    categories: Object
})

const emit = defineEmits([
    'close',
    'save'
])

// The selected type (Income/Expense)  (v-model for the radio group element)
const type = ref(props.payee.type ? props.payee.type : 'Expense')

// The selected category name (v-model for the v-select element)
const categoryName = ref(props.payee.categoryName)

// The selected subcategory name (v-model for the select element)
const subcategoryName = ref(props.payee.subcategoryName)

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

// just the names of the categories, to be listed in the select
const categoryNames = computed(() => {
    return categories.value.map(c => c.name)
})

// just the names of the subcategories, to be listed in the select
const subcategoryNames = computed(() => {
    return subcategories.value.map(s => s.name)
})

function findCategoryByName(name) {
    let c = null
    if(props.payee.categoryName !== '') {
        c = categories.value.find(c => c.name === name)
    }
    return c
}

// handle a change in categories, and also run intially.
// this will happen as a result of type change (Income/Expense)
watchEffect(() => {
    const c = findCategoryByName(props.payee.categoryName)
    if(c) {
        // The payee's categoryName appears in the list of categories 
        // for this type
        categoryName.value = props.payee.categoryName
    } else {
        // The payee's categoryName does not appear in the list of categories 
        // for this type
        categoryName.value = ''
    }
})

// handle a change in categories, and also run intially.
// this will happen as a result of type change (Income/Expense)
watch(categoryName, () => {
    if(categoryName.value === '') {
        // categoryName is empty. Clear subcategoryName and categories.
        subcategoryName.value = ''
        subcategories.value = []
    } else {
        // a categoryName is selected. Set subcategories accordingly.
        const c = findCategoryByName(categoryName.value)
        if(c === null) {
            return
        }
        subcategories.value = c.subcategories

        // And set subcategoryName accordingly.
        const s = c.subcategories.find(s => s.name === props.payee.subcategoryName)
        subcategoryName.value = s ? props.payee.subcategoryName : ''
    }
})

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
                <v-select label="Category" :items="categoryNames" v-model="categoryName"/>
                <v-select label="Subcategory" :items="subcategoryNames" v-model="subcategoryName"/>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" block @click="emit('close')">Close</v-btn>
        </v-card-actions>
    </v-card>
</template>