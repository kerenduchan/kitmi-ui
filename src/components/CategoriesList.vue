<script setup>
import { ref, computed, watch } from 'vue'
import SubcategoriesList from '@/components/SubcategoriesList.vue';
import TypeExpenseOrIncomeIcon from '@/components/TypeExpenseOrIncomeIcon.vue'

// props 
const props = defineProps({
    categories: Object
})

// emits
const emit = defineEmits([
    'select'
])

// the selected category ID (v-model for the v-expansion-panels)
const selectedCategoryId = ref(null)

// the selected subcategory ID
const selectedSubcategoryId = ref(null)

const selectedCategory = computed(() => {
    if(selectedCategoryId.value === null) {
        return null
    }
    const found = props.categories.find(c => c.id === selectedCategoryId.value)
    return found ? found : null
}) 

const selectedSubcategory = computed(() => {
    if(selectedSubcategoryId.value === null || selectedCategory.value === null) {
        return null
    }
    const found = selectedCategory.value.subcategories.find(
        s => s.id === selectedSubcategoryId.value)
    return found ? found : null
}) 

const selectedItem = computed(() => {
    if(selectedSubcategory.value !== null) {
        return selectedSubcategory.value
    }
    return selectedCategory.value
})

watch(selectedCategoryId, () => {
    selectedSubcategoryId.value = null
})

watch(selectedItem, () => {
    emit('select', selectedItem.value)
})

function handleSubcategorySelected(subcategoryId) {
    selectedSubcategoryId.value = subcategoryId
    forceSelectSubcategoryId.value = null
}

function handleExpansionPanelClicked() {
    forceSelectSubcategoryId.value = null
}

function selectCategory(categoryId) {
    selectedCategoryId.value = categoryId
}

const forceSelectSubcategoryId = ref(null)

function selectSubcategory(subcategoryId) {
    // find the category containing this subcategory
    const found = props.categories.find(
        c => c.subcategories.find(
            s => s.id === subcategoryId) !== undefined)
    if(found !== undefined) {
        selectedCategoryId.value = found.id
        // can't select a subcategory ID at this point since the 
        // SubcategoriesList child component hasn't been rendered yet. It will
        // be rendered after the expansion panel for the category is expanded, 
        // as an indirect result of setting selectedCategoryId.
        forceSelectSubcategoryId.value = subcategoryId
    }
}

// exposing these functions so that the parent component can force
// select a category / subcategory
defineExpose({
    selectCategory,
    selectSubcategory
})

</script>

<template>

    <v-expansion-panels class="pa-4" v-model="selectedCategoryId">

        <!-- Category -->
        <v-expansion-panel  v-for="c in categories" :value="c.id" @click="handleExpansionPanelClicked">
            <v-expansion-panel-title>
                <span class="category-type-icon">
                    <TypeExpenseOrIncomeIcon :type="c.type" />
                </span>
                {{ c.name }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>

                <!-- Subcategories of the current category -->
                <SubcategoriesList
                    :forceSelectSubcategoryId="forceSelectSubcategoryId"
                    :subcategories="c.subcategories"
                    @select="handleSubcategorySelected"
                />
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>

</template>

<style>
.category-type-icon {
    padding-right: 10px;
}
</style>