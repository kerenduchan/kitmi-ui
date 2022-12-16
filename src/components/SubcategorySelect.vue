<script setup>
import { ref, computed, watchEffect, watch } from 'vue'

// props 
const props = defineProps({
    item: Object,
    categories: Object
})

// emits
const emit = defineEmits([
    'change'
])

// The selected type (Income/Expense)  (v-model for the radio group element)
const type = ref(props.item.type ? props.item.type : 'Expense')

// The selected category ID (v-model for the v-select element)
const categoryId = ref(props.item.categoryId)

// The selected subcategory ID (v-model for the select element)
const subcategoryId = ref(props.item.subcategoryId)

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
    const c = findCategoryById(props.item.categoryId)
    if(c) {
        // The payee's categoryId appears in the list of categories
        categoryId.value = props.item.categoryId
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
        const s = findSubcategoryById(props.item.subcategoryId)
        subcategoryId.value = s ? props.item.subcategoryId : null
    }
})

watch(subcategoryId, () => {
    emit("change", {
        type: type.value,
        categoryId: categoryId.value,
        subcategoryId: subcategoryId.value
    })
})

</script>

<template>
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
</template>