<script setup>
import { ref } from 'vue'
import TextCell from './TextCell.vue'
import ErrorLine from './ErrorLine.vue'
import createCategory from '../composables/createCategory'

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

const { gqlCreateCategory, onDone, onError } = createCategory()

// any error message when attempting to create a category
const errorMessage = ref(null)

// controls whether to show or hide the form
const show = ref(false)

// create a new category
function doCreateCategory(name) {
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
      <TextCell text="" @cancel="cancel" @submit="doCreateCategory"/>
    </span>
    <ErrorLine :text="errorMessage" />
</template>

