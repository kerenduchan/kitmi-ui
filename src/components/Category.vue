<script setup>
import { ref } from 'vue'
import CreateSubcategory from './CreateSubcategory.vue'

const props = defineProps({
  category: Object
})

// declare emitted events
const emit = defineEmits(['createSubcategory'])

const showAddSubcategory = ref(false)

function toggleShowAddSubcategory() {
    showAddSubcategory.value = !showAddSubcategory.value
}

function createSubcategory(name) {
  showAddSubcategory.value = false

  // emit event to parent component
  emit('createSubcategory', props.category.id, name)

}

</script>

<template>
            ({{ props.category.id }}) {{ props.category.name }} <a @click="toggleShowAddSubcategory()">+</a>
            <CreateSubcategory :categoryId=props.category.id v-if="showAddSubcategory" @createSubcategory="createSubcategory"/>
            <ul v-if="props.category.subcategories">
                <li v-for="s of props.category.subcategories" :key="s.id">
                  ({{ s.id }}) {{ s.name }}
                </li>
            </ul>

</template>

