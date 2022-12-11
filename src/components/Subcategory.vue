<script setup>
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import RenameForm from './RenameForm.vue'

// This component represents one subcategory of one category in the 
// Categories view.

// props 
const props = defineProps({
  categoryId: String,
  subcategory: Object,
})

// events
const emit = defineEmits([
    'subcategoryDeleted'
])

// whether or not this subcategory is in edit mode (editable name)
const isEditMode = ref(false)

// any error message when attempting to rename a subcategory
const errorMessage = ref(null)

// delete this subcategory
function deleteSubcategory() {
    console.log('delete subcategory ' + props.subcategory.name  + ' (ID=' + props.subcategory.id + ')')
    gqlDeleteSubcategory({ 
        subcategoryId: props.subcategory.id
    })
}

// gql mutation for deleting a subcategory
const { mutate: gqlDeleteSubcategory, onDone: onDeleteDone } = 
useMutation(gql`
      mutation deleteSubcategory ($subcategoryId: ID!) {
        deleteSubcategory (subcategoryId: $subcategoryId)
      }
    `)

    // hook: subcategory deleted successfully
onDeleteDone(() => {
    emit('subcategoryDeleted')
})

// rename this subcategory
function renameSubcategory(newName) {
    console.log('rename subcategory from ' + props.subcategory.name + ' to ' + newName)
    gqlRenameSubcategory({ 
        subcategoryId: props.subcategory.id, 
        name: newName
    })
}

// gql mutation for renaming a subcategory
const { mutate: gqlRenameSubcategory, onDone: onRenameDone, onError:onRenameError } = 
useMutation(gql`
      mutation renameSubcategory ($subcategoryId: ID!, $name: String!) {
        renameSubcategory (subcategoryId: $subcategoryId, name: $name) {
          id
          name
        }
      }
    `)

// hook: subcategory renamed successfully
onRenameDone(() => {
    exitEditMode()
})

// hook: rename subcategory failed
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

<div>
    <span>({{ props.subcategory.id }}) </span>
    <span v-if="!isEditMode">
        <span  @click="enterEditMode">{{ props.subcategory.name }}</span>   
        <span @click="deleteSubcategory"> - </span>
    </span>
    <span v-else>
        <RenameForm @cancel="exitEditMode" @submit="renameSubcategory" :error="errorMessage"/>
    </span>
</div>

</template>

