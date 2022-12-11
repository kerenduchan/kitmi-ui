<script setup>
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
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

// whether or not this category is in edit mode (editable name)
const isEditMode = ref(false)

// the new category name (user input, in edit mode)
const newName = ref(props.category.name)

// any error message when attempting to rename a category
const errorMessage = ref(null)

// handle a subcategory created event
function onSubcategoryCreated() {
  // notify the parent component that something changed in this category
  emit('categoryChanged', props.category.id)
  // hide the Create Subcategory component
}

// handle a subcategory created event
function onSubcategoryDeleted() {
  // notify the parent component that something changed in this category
  emit('categoryChanged', props.category.id)
}

// rename this category
function renameCategory() {
    console.log('rename category from ' + props.category.name + ' to ' + newName.value)
    gqlRenameCategory({ 
        categoryId: props.category.id, 
        name: newName.value
    })
}

// gql mutation for renaming a category
const { mutate: gqlRenameCategory, onDone: onRenameDone, onError:onRenameError } = 
useMutation(gql`
      mutation renameCategory ($categoryId: ID!, $name: String!) {
        renameCategory (categoryId: $categoryId, name: $name) {
          id
          name
        }
      }
    `)

// hook: category renamed successfully
onRenameDone(() => {
    exitEditMode()
})

// hook: rename category failed
onRenameError(error => {
    console.error('Error: ' + error.message)
    errorMessage.value = error.message
})


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

</script>

<template>

<span>({{ props.category.id }}) </span>
    <span v-if="!isEditMode">
        <span  @click="enterEditMode">{{ props.category.name }}</span>
        <CreateSubcategory 
          :categoryId=props.category.id 
          @subcategoryCreated="onSubcategoryCreated" 
        />
        
    </span>
    <form class="flat-form" v-else @submit.prevent="renameCategory">
            <input type="text" @keyup.escape="exitEditMode" v-model="newName" />
            <button type="submit">Save</button>
            <button type="button" @click="exitEditMode">Cancel</button>
            <div class="error" v-if="errorMessage">Error: {{ errorMessage }}</div>
    </form>
    <ul v-if="props.category.subcategories">
      <li v-for="s of props.category.subcategories" :key="s.id">
        <Subcategory :categoryId="props.category.id" :subcategory="s" @subcategoryDeleted="onSubcategoryDeleted"/>
      </li>
    </ul>

</template>

