<script setup>
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

// This component represents one subcategory of one category in the 
// Categories view.

// props 
const props = defineProps({
  categoryId: String,
  subcategory: Object,
})

// whether or not this subcategory is in edit mode (editable name)
const isEditMode = ref(false)

// the new subcategory name (user input, in edit mode)
const newName = ref(props.subcategory.name)

// any error message when attempting to rename a subcategory
const errorMessage = ref(null)

// delete this subcategory
function deleteSubcategory() {
    console.log('delete')
}

// rename this subcategory
function renameSubcategory() {
    console.log('rename subcategory from ' + props.subcategory.name + ' to ' + newName.value)
    gqlRenameSubcategory({ 
        subcategoryId: props.subcategory.id, 
        name: newName.value
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
    newName.value = props.subcategory.name
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
            <input type="text" @keyup.escape="exitEditMode" v-model="newName" />
            <button @click="renameSubcategory">Save</button>
            <button @click="exitEditMode">Cancel</button>
            <div class="error" v-if="errorMessage">Error: {{ errorMessage }}</div>
    </span>
</div>

</template>

