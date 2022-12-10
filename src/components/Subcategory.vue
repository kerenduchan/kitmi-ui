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

const isEditMode = ref(false)

const newName = ref(props.subcategory.name)

const newNameInput = ref(null)


function deleteSubcategory() {
    console.log('delete')
}

function renameSubcategory() {
    console.log('renameSubcategory to ' + newName.value)
}

function enterEditMode() {
    isEditMode.value = true
    newName.value = props.subcategory.name
}

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
            <input type="text" ref="newNameInput" @keyup.escape="exitEditMode" v-model="newName" />
            <button @click="renameSubcategory">Save</button>
            <button @click="exitEditMode">Cancel</button>
    </span>
</div>

</template>

