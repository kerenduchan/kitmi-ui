<script setup>
import { ref } from 'vue'
import CreateSubcategory from './CreateSubcategory.vue'
import Subcategory from './Subcategory.vue'

// This component represents one category and its subcategories in the 
// Categories view.

// props 
const props = defineProps({
  category: Object
})

// events 
const emit = defineEmits([
  'categoryChanged'
])

// controls whether to show or hide the Create Subcategory component
const showCreateSubcategory = ref(false)

// toggle show/hide for the Create Subcategory component
function toggleShowAddSubcategory() {
    showCreateSubcategory.value = !showCreateSubcategory.value
}

// handle a subcategory created event
function onSubcategoryCreated() {
  // notify the parent component that something changed in this category
  emit('categoryChanged', props.category.id)
  // hide the Create Subcategory component
  showCreateSubcategory.value = false
}

</script>

<template>

({{ props.category.id }}) {{ props.category.name }} <a @click="toggleShowAddSubcategory()">+</a>
<div v-show="showCreateSubcategory">
  <CreateSubcategory :categoryId=props.category.id @subcategoryCreated="onSubcategoryCreated" />
</div>
<ul v-if="props.category.subcategories">
  <li v-for="s of props.category.subcategories" :key="s.id">
    <Subcategory :categoryId="props.category.id" :subcategory="s" />
  </li>
</ul>

</template>

