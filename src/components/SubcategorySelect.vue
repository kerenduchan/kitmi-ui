<script setup>
import { ref, computed, watchEffect, watch } from 'vue'

// props 
const props = defineProps({
    defaults: Object,
    showExpenseCategoriesFirst: Boolean,
    categories: Object
})

// emits
const emit = defineEmits([
    'subcategorySelected'
])

// The selected category ID (v-model for the v-select element)
const categoryId = ref(props.defaults.categoryId)

// The selected subcategory ID (v-model for the select element)
const subcategoryId = ref(props.defaults.subcategoryId)

watch(subcategoryId, () => {
    emit('subcategorySelected', subcategoryId.value)
})

// The expense categories that have subcategories
const expenseCategories = computed(() => {
    return props.categories.filter(c => c.isExpense && c.hasSubcategories)
})

// The income categories that have subcategories
const incomeCategories = computed(() => {
    return props.categories.filter(c => !c.isExpense && c.hasSubcategories)
})

// The categories, in the order that they should appear in the
// v-select, including a divider between income/expense categories
const categories = computed(() => {
    const firstList = props.showExpenseCategoriesFirst ?
        expenseCategories.value :
        incomeCategories.value

    const secondList = props.showExpenseCategoriesFirst ?
        incomeCategories.value :
        expenseCategories.value

    return firstList.concat(secondList)
})

// The list of possible subcategories shown in the select.
// Depends on the selected category.
const subcategories = ref([])

// find category by category ID
function findCategoryById(id) {
    let c = null
    if (id !== null) {
        c = categories.value.find(c => c.id === id)
    }
    return c ? c : null
}

// find subcategory by subcategory ID
function findSubcategoryById(id) {
    let s = null
    if (id !== null) {
        s = subcategories.value.find(s => s.id === id)
    }
    return s ? s : null
}

// handle a change in the selected categoryId
watchEffect(() => {
    if (categoryId.value === null) {
        // No category is selected. Clear subcategoryId and subcategories.
        subcategoryId.value = null
        subcategories.value = []
    } else {
        // A category is selected. Set subcategories accordingly.
        const c = findCategoryById(categoryId.value)
        if (c === null) {
            return
        }
        subcategories.value = c.subcategories
        // And set subcategoryId accordingly.
        const s = findSubcategoryById(props.defaults.subcategoryId)
        if(s) {
            subcategoryId.value = props.defaults.subcategoryId
        } else if(subcategories.value.length === 1) {
            subcategoryId.value = subcategories.value[0].id
        } else {
            subcategoryId.value = null
        }
    }
})

</script>

<template>

    <div v-if="categories.length === 0">
        Define a few categories and subcategories first.
    </div>
    
    <!-- Category select -->
    <v-select 
        label="Category" 
        :items="categories" 
        :disabled="categories.length === 0"
        item-title="name" 
        item-value="id" 
        v-model="categoryId" 
    />

    <!-- Subcategory select -->
    <v-select 
        label="Subcategory" 
        :items="subcategories" 
        :disabled="categoryId === null"
        item-title="name" 
        item-value="id" 
        v-model="subcategoryId" 
    />
</template>