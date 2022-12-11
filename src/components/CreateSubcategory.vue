<script setup>
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import TextCell from './TextCell.vue'
import ErrorLine from './ErrorLine.vue'

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
function createSubcategory(name) {
    console.log('creating subcategory for category ID=' + props.categoryId
        + ": " + name)

    errorMessage.value = null
    gqlCreateSubcategory({ 
        categoryId: props.categoryId, 
        name: name
    })
}

// hook: subcategory created successfully
onDone(() => {
  show.value = false
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

  <a v-if="!show" @click="toggleShow"> +</a>
    <span v-if="show">
      <TextCell text="" @cancel="cancel" @submit="createSubcategory"/>
    </span>
    <ErrorLine :text="errorMessage" />
</template>

