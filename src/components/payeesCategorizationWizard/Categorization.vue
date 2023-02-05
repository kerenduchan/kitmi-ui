<script setup>
import { ref, computed } from 'vue'
import Breadcrumbs from './Breadcrumbs.vue'
import SelectOneOfMany from '../SelectOneOfMany.vue'
import TypeIcon from '../TypeIcon.vue'

const props = defineProps({
    payee: Object,
    categories: Object
})

const emit = defineEmits([
    'categorySelected',
    'subcategorySelected'
])



// the index of the selected category in props.categories
const categoryIdx = ref(getCategoryIdx())

// the selected category
const category = computed(() => {
    if (categoryIdx.value === null) {
        return null
    }
    return props.categories[categoryIdx.value]
})

// the subcategories of the selected category
const subcategories = computed(() => {
    if (category.value === null) {
        return null
    }
    return category.value.subcategories
})

// the index of the selected subcategory in the selected category
const subcategoryIdx = ref(getSubcategoryIdx())

// the selected subcategory
const subcategory = computed(() => {
    if (subcategories.value === null || subcategoryIdx.value === null) {
        return null
    }
    return subcategories.value[subcategoryIdx.value]
})

function clearCategory() {
    categoryIdx.value = null
    emit('categorySelected', null)
    clearSubcategory()
}

function clearSubcategory() {
    subcategoryIdx.value = null
    emit('subcategorySelected', null)
}

const showCategorySelect = computed(() => {
    // show the category selection item group 
    // if a category is not selected
    return categoryIdx.value === null
})

const showSubcategorySelect = computed(() => {
    // show the subcategory selection item group 
    // if a category is selected and a subcategory is not selected
    return categoryIdx.value !== null && subcategoryIdx.value === null
})

// get the index in the categories array of the payee's category
function getCategoryIdx() {
    if (props.payee.category === null) {
        return null
    }
    const foundIdx = props.categories.findIndex(
        c => c.id === props.payee.category.id)
    return foundIdx === -1 ? null : foundIdx
}

// get the index in the subcategories array of the payee's subcategory
function getSubcategoryIdx() {
    if (props.payee.subcategory === null) {
        return null
    }
    const foundIdx = subcategories.value.findIndex(
        s => s.id === props.payee.subcategory.id)
    return foundIdx === -1 ? null : foundIdx
}

function handleCategorySelected(idx) {
    categoryIdx.value = idx
    emit('categorySelected', props.categories[idx].id)
}

function handleSubcategorySelected(idx) {
    subcategoryIdx.value = idx
    emit('subcategorySelected', subcategories.value[idx].id)
}

</script>

<template>

    <!-- the "breadcrumbs" of the selected category and subcategory -->
    <Breadcrumbs :category="category" :subcategory="subcategory" @categoryClicked="clearCategory"
        @subcategoryClicked="clearSubcategory" />

    <!-- category select -->
    <div v-if="showCategorySelect" class="flex-grow-1 d-flex flex-column overflow-y-hidden">
        <div class="pt-3">Category:</div>
        <SelectOneOfMany :items="categories" @selected="handleCategorySelected" v-slot="slotProps">
            <div class="v-flex gap-3">
                <TypeIcon :type="slotProps.item.type" :isExcluded="slotProps.item.excludeFromReports" />
                {{ slotProps.item.name }}
            </div>
        </SelectOneOfMany>
    </div>

    <!-- subcategory select -->
    <div v-if="showSubcategorySelect" class="flex-grow-1 d-flex flex-column overflow-y-hidden">
        <div class="pt-3">Subcategory:</div>
        <SelectOneOfMany :items="subcategories" @selected="handleSubcategorySelected" v-slot="slotProps">
            {{ slotProps.item.name }}
        </SelectOneOfMany>
    </div>
</template>
