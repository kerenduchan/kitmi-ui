<script setup>
import { ref } from 'vue'

// This component represents one subcategory of one category in the 
// Categories view.

// props 
const props = defineProps({
  categoryId: String,
  subcategory: Object,
})

// events 
const emit = defineEmits([
    'subcategoryDeleted',
    'subcategoryEdited',
])

</script>

<template>

<div>({{ props.subcategory.id }}) {{ props.subcategory.name }}</div>

</template>

