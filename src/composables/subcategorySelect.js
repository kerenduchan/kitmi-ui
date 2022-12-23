import { ref, computed, watch } from 'vue'

// Logic (composable) for the SubcategorySelect component.
function subcategorySelect(categories, defaults, showExpenseCategoriesFirst = true) {

    const selectedCategoryId = ref(defaults.categoryId)
    const selectedSubcategoryId = ref(defaults.subcategoryId)

    // The categories, in the order that they should appear in the v-select
    const filteredCategories = computed(() => {
        const expenseCategories = categories.filter(c => c.isExpense && c.hasSubcategories)
        const incomeCategories = categories.filter(c => !c.isExpense && c.hasSubcategories)

        if (showExpenseCategoriesFirst) {
            return expenseCategories.concat(incomeCategories)
        }

        return incomeCategories.concat(expenseCategories)
    })

    // The subcategories that should appear in the select.
    const filteredSubcategories = computed(() => {
        if (!selectedCategoryId.value) {
            return null
        }
        return getCategoryById(selectedCategoryId.value).subcategories
    })

    // Handle a change in the selected category ID.
    watch(selectedCategoryId, () => {
        if (selectedCategoryId.value === defaults.categoryId) {
            // The selected category ID is now the default value.
            // Set the selected subcategory ID to the default value as well.
            selectedSubcategoryId.value = defaults.subcategoryId
            return
        }
        const subcategories = getCategoryById(selectedCategoryId.value).subcategories
        if(subcategories.length === 1) {
            // There's only one subcategory for the selected category. Auto-select it
            selectedSubcategoryId.value = subcategories[0].id
        } else {
            // Clear the selected subcategory ID.
            selectedSubcategoryId.value = null
        }
    })

    function getCategoryById(categoryId) {
        const found = filteredCategories.value.find(c => c.id === categoryId)
        return found ? found : null
    }

    function handleCategorySelected(categoryId) {
        selectedCategoryId.value = categoryId
    }

    function handleSubcategorySelected(subcategoryId) {
        selectedSubcategoryId.value = subcategoryId
    }

    return {
        selectedCategoryId,
        selectedSubcategoryId,
        filteredCategories,
        filteredSubcategories,
        handleCategorySelected,
        handleSubcategorySelected
    }
}

export default subcategorySelect