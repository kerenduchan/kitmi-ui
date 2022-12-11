<script setup>
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import TextCell from './TextCell.vue'
import ErrorLine from './ErrorLine.vue'
import SubcategoriesList from './SubcategoriesList.vue'

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

// any error message when attempting to rename a category
const errorMessage = ref(null)

function onChange() {
  // notify the parent component that something changed in this category
  emit('categoryChanged', props.category.id)
}

// rename this category
function renameCategory(newName) {
    console.log('rename category from ' + props.category.name + ' to ' + newName)
    gqlRenameCategory({ 
        categoryId: props.category.id, 
        name: newName
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
}

// exit edit mode
function exitEditMode() {
    isEditMode.value = false
    errorMessage.value = null
}

</script>

<template>
    <span v-if="!isEditMode">
        <span  @click="enterEditMode">{{ props.category.name }}</span>        
    </span>
    <span v-else>
        <TextCell 
            :text="props.category.name"
            @cancel="exitEditMode"
            @submit="renameCategory"
        />
        <ErrorLine :text="errorMessage" />
    </span>

    <SubcategoriesList 
        :subcategories="props.category.subcategories"
        :categoryId="props.category.id"
        @change="onChange"
    />

</template>

