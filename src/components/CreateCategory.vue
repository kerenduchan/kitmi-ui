<script setup>
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import TextCell from './TextCell.vue'
import ErrorLine from './ErrorLine.vue'

// This component represents the "Create Category" form
// in the Categories view.

// props 
const props = defineProps({
  isExpense: Boolean
})

// events
const emit = defineEmits([
    'created'
])

// any error message when attempting to create a category
const errorMessage = ref(null)

// gql mutation for creating a category
const { mutate: gqlCreateCategory, onDone, onError } = useMutation(gql`
      mutation createCategory ($name: String!, $isExpense: Boolean!) {
        createCategory (name: $name, isExpense: $isExpense) {
          id
          name
          isExpense
        }
      }
    `)

// create a new category
function createCategory(name) {
    console.log('creating category: ' + name)
    errorMessage.value = null
    gqlCreateCategory({ 
        name: name,
        isExpense: props.isExpense
    })
}

// hook: category created successfully
onDone(() => {
  show.value = false
  emit('created')
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
      <TextCell text="" @cancel="cancel" @submit="createCategory"/>
    </span>
    <ErrorLine :text="errorMessage" />
</template>

