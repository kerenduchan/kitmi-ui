<script setup>
import { ref, onMounted } from 'vue'

// props 
const props = defineProps({
  text: String,
})

// events
const emit = defineEmits([
    'cancel',
    'submit'
])

// the new text (user input)
const newText = ref(props.text)

// helps to prevent double-submit as a result of focus out
const isDone = ref(false)

function cancel() {
    isDone.value = true
    emit('cancel')
}

function submit() {
     if(newText.value != props.text) {
        emit('submit', newText.value)
    } else {
        // no change
        emit('cancel')
    }
    isDone.value = true
}

function onFocusOut() {
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
            <input ref="input" type="text" @focusout="onFocusOut" @keyup.escape="cancel" v-model="newText" />
        </form>
</template>