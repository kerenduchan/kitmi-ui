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

// whether or not this category is in edit mode (editable name)
const isEditMode = ref(false)

// the new category name (user input, in edit mode)
const newName = ref(props.category.name)

// any error message when attempting to rename a category
const errorMessage = ref(null)

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

// handle a subcategory created event
function onSubcategoryDeleted() {
  // notify the parent component that something changed in this category
  emit('categoryChanged', props.category.id)
}

// enter edit mode
function enterEditMode() {
    isEditMode.value = true
    newName.value = props.category.name
}

// exit edit mode
function exitEditMode() {
    isEditMode.value = false
    errorMessage.value = null
}

// rename this category
function renameCategory() {
  console.log('rename category')
}

</script>

<template>

<span>({{ props.category.id }}) </span>
    <span v-if="!isEditMode">
        <span  @click="enterEditMode">{{ props.category.name }}</span>
        <a @click="toggleShowAddSubcategory()"> +</a>
        <div v-show="showCreateSubcategory">
          <CreateSubcategory :categoryId=props.category.id @subcategoryCreated="onSubcategoryCreated" />
        </div>
    </span>
    <span v-else>
            <input type="text" @keyup.escape="exitEditMode" v-model="newName" />
            <button @click="renameCategory">Save</button>
            <button @click="exitEditMode">Cancel</button>
            <div class="error" v-if="errorMessage">Error: {{ errorMessage }}</div>
    </span>
    <ul v-if="props.category.subcategories">
      <li v-for="s of props.category.subcategories" :key="s.id">
        <Subcategory :categoryId="props.category.id" :subcategory="s" @subcategoryDeleted="onSubcategoryDeleted"/>
      </li>
    </ul>

</template>

