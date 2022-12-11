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
  name.value = ""
  emit('subcategoryCreated')
})

// hook: create subcategory failed
onError(error => {
    console.error('Error: ' + error.message)
    errorMessage.value = error.message
})

// controls whether to show or hide the form
const show = ref(false)

function cancel() {
  name.value = ""
  errorMessage.value = ""
  show.value = false
}

function toggleShow() {
  if(show.value === true) {
    cancel()
  } else {
    show.value = true
  }
}

</script>

<template>

  <a @click="toggleShow"> +</a>

    <form v-if="show" @submit.prevent="createSubcategory">
        <label>Create Subcategory:</label>
        <input @keyup.escape="cancel" v-model="name">
        <button type="submit">Create</button>
        <button type="button" @click="cancel">Cancel</button>

    </form>
    <div class="error" v-if="errorMessage">Error: {{ errorMessage }}</div>
</template>

