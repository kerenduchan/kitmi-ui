<script setup>
import { isExact } from 'ts-essentials';
import Category from '../components/Category.vue'

// props 
const props = defineProps({
  categories: Object,
  isExpense: Boolean
})

// events 
const emit = defineEmits([
  'categoryChanged'
])

function onCategoryChanged(categoryId) {
  // notify the parent component that something changed in this category
  emit('categoryChanged', props.category.id)
}

const title = props.isExpense ? "Expense" : "Income"

</script>

<template>
    <h2>{{title}} Categories</h2>
        <ul>
        <li v-for="c of props.categories" :key="c.id">
            <Category :category="c" @categoryChanged="onCategoryChanged"/>
        </li>
    </ul>
</template>