<script setup>
import { ref } from 'vue'

const props = defineProps({
  categoryId: String
})

// declare emitted events
const emit = defineEmits(['createSubcategory'])

const name = ref("")

function createSubcategory() {    
    // emit event to parent component
    emit('createSubcategory', name.value)
    
    // clear subcategory name
    name.value = ''
}

</script>

<template>
    <form @submit.prevent="createSubcategory">
        <label>Create Subcategory:</label>
        <input v-model="name">
        <button type="submit">Create</button>
    </form>
</template>

