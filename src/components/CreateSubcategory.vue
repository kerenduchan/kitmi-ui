<script setup>
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

// This component represents the "Create Subcategory" form for one category
// in the Categories view.

// props 
const props = defineProps({
  categoryId: String
})

// events
const emit = defineEmits([
    'subcategoryCreated'
])


// the name of the subcategory about to be created (entered by the user)
const name = ref("")

// any error message when attempting to create a subcategory
const errorMessage = ref(null)

// gql mutation for creating a subcategory
const { mutate: gqlCreateSubcategory, onDone, onError } = useMutation(gql`
      mutation createSubcategory ($categoryId: ID!, $name: String!) {
        createSubcategory (categoryId: $categoryId, name: $name) {
          id
          name
        }
      }
    `)

// create a new subcategory for this category
function createSubcategory() {
    console.log('creating subcategory for category ID=' + props.categoryId
        + ": " + name.value)

    errorMessage.value = null
    gqlCreateSubcategory({ 
        categoryId: props.categoryId, 
        name: name.value
    })
}

// hook: subcategory created successfully
onDone(() => {
  emit('subcategoryCreated')
})

// hook: create subcategory failed
onError(error => {
    console.error('Error: ' + error.message)
    errorMessage.value = error.message
})

</script>

<template>
    <form @submit.prevent="createSubcategory">
        <label>Create Subcategory:</label>
        <input v-model="name">
        <button type="submit">Create</button>
    </form>
    <div class="error" v-if="errorMessage">Error: {{ errorMessage }}</div>
</template>

