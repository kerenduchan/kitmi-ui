<script setup>
import { ref, watch, watchEffect } from 'vue'

// props 
const props = defineProps({
    categoryId: String,
    subcategoryId: String,
    categories: Object,
    subcategories: Object,
    disabled: Boolean
})

// emits
const emit = defineEmits([
    'categorySelected',
    'subcategorySelected'
])

// The selected category ID (v-model for the v-select element)
const categoryId = ref(props.categoryId)

// The selected subcategory ID (v-model for the select element)
const subcategoryId = ref(null)

watchEffect(() => {
    categoryId.value = props.categoryId
    subcategoryId.value = props.subcategoryId
})

watch(categoryId, () => {
    if(categoryId.value !== props.categoryId) {
        emit('categorySelected', categoryId.value)
    }
})

watch(subcategoryId, () => {
    if(subcategoryId.value !== props.subcategoryId) {
        emit('subcategorySelected', subcategoryId.value)
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
        :disabled="disabled || categories.length === 0"
        item-title="name" 
        item-value="id" 
        v-model="categoryId" 
    />

    <!-- Subcategory select -->
    <v-select 
        label="Subcategory" 
        :items="subcategories" 
        :disabled="disabled || categoryId === null"
        item-title="name" 
        item-value="id" 
        v-model="subcategoryId" 
    />
</template>