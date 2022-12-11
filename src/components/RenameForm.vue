<script setup>
import { ref } from 'vue'

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

function cancel() {
    emit('cancel')
}

function submit() {
    emit('submit', newName.value)
}

// the new name (user input)
const newName = ref(props.name)

</script>


<template>
        <form class="flat-form" @submit.prevent="submit">
            <input type="text" @keyup.escape="cancel" v-model="newName" />
            <button type="submit">Save</button>
            <button type="button" @click="cancel">Cancel</button>
            <div class="error" v-if="props.error">Error: {{ props.error }}</div>
        </form>
</template>