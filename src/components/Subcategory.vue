<script setup>
import { ref } from 'vue'

// This component represents one subcategory of one category in the 
// Categories view.

// props 
const props = defineProps({
  categoryId: String,
  subcategory: Object,
})

// events 
const emit = defineEmits([
    'subcategoryDeleted',
    'subcategoryEdited',
])

// whether or not this subcategory is in edit mode (editable name)
const isEditMode = ref(false)

// the new subcategory name (user input, in edit mode)
const newName = ref(props.subcategory.name)

// delete this subcategory
function deleteSubcategory() {
    console.log('delete')
}

// rename this subcategory
function renameSubcategory() {
    console.log('renameSubcategory to ' + newName.value)
}

// enter edit mode
function enterEditMode() {
    isEditMode.value = true
    newName.value = props.subcategory.name
}

// exit edit mode
function exitEditMode() {
    isEditMode.value = false
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
    </span>
</div>

</template>

