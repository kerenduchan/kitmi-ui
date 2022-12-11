<script setup>
import Category from '../components/Category.vue'
import CreateCategory from '../components/CreateCategory.vue'

// props 
const props = defineProps({
  categories: Object,
  isExpense: Boolean
})

// events 
const emit = defineEmits([
  'change'
])

function onChange() {
  // notify the parent component that something changed
  emit('change')
}

const title = props.isExpense ? "Expense" : "Income"

</script>

<template>
    <h2>{{ title }} Categories</h2>

    <CreateCategory 
        :isExpense="props.isExpense" 
        @created="onChange" 
    />

    <ul>
        <li v-for="c of props.categories" :key="c.id">
            <Category 
                :category="c" 
                @change="onChange" 
            />
        </li>
    </ul>
</template>