<script setup>
import { EntityStore } from '@apollo/client/cache';
import { ref, onMounted } from 'vue'

// props 
const props = defineProps({
  name: String,
  error: String
})

// events
const emit = defineEmits([
    'cancel',
    'submit'
])

// the new name (user input)
const newName = ref(props.name)

// helps to prevent double-submit as a result of focus out
const isDone = ref(false)

function cancel() {
    console.log('cancel')
    isDone.value = true
    emit('cancel')
}

function submit() {
    console.log('submit')
     if(newName.value != props.name) {
        emit('submit', newName.value)
    } else {
        // no change
        emit('cancel')
    }
    isDone.value = true
}

function onFocusOut() {
    console.log('onFocusOut')
    if(!isDone.value) {
        submit()
    }
}
// ref to the input field (in order to put it in focus when mounted)
const input = ref(null)

onMounted(() => {
    input.value.focus()
    input.value.select()
})

</script>


<template>
        <form class="flat-form" @submit.prevent="submit">
            <input ref="input" type="text" @focusout="onFocusOut" @keyup.escape="cancel" v-model="newName" />
            <div class="error" v-if="props.error">Error: {{ props.error }}</div>
        </form>
</template>