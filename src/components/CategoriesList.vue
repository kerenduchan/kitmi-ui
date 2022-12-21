<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import SubcategoriesList from '@/components/SubcategoriesList.vue';
import TypeExpenseOrIncomeIcon from '@/components/TypeExpenseOrIncomeIcon.vue'

// props 
const props = defineProps({
    categories: Object,
    forceSelectedCategoryId: String
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

watchEffect(() => {
    if(props.forceSelectedCategoryId !== null) {
        selectedCategoryId.value = props.forceSelectedCategoryId
        selectedSubcategoryId.value = null
    }
})

function handleSubcategorySelected(subcategoryId) {
    selectedSubcategoryId.value = subcategoryId
}

</script>

<template>

    <v-expansion-panels class="pa-4" v-model="selectedCategoryId">

        <!-- Category -->
        <v-expansion-panel  v-for="c in categories" :value="c.id">
            <v-expansion-panel-title>
                <span class="category-type-icon">
                    <TypeExpenseOrIncomeIcon :type="c.type" />
                </span>
                {{ c.name }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>

                <!-- Subcategories of the current category -->
                <SubcategoriesList 
                    :subcategories="c.subcategories" 
                    @select="handleSubcategorySelected"/>

            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>

</template>

<style>
.category-type-icon {
    padding-right: 10px;
}
</style>