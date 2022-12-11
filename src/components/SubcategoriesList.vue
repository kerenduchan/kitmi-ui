<script setup>
import CreateSubcategory from './CreateSubcategory.vue'
import Subcategory from './Subcategory.vue'

// props 
const props = defineProps({
    subcategories: Object,
    categoryId: String
})

// events 
const emit = defineEmits([
  'change'
])

function onChange() {
    emit('change')
}
</script>

<template>

    <ul v-if="props.subcategories">
        <li v-for="s of props.subcategories" :key="s.id">
            <Subcategory 
                :categoryId="props.categoryId"
                :subcategory="s" 
                @subcategoryDeleted="onChange" 
            />
        </li>
    </ul>
    <CreateSubcategory 
        :categoryId=props.categoryId 
        @subcategoryCreated="onChange" 
    />

</template>