<script setup>
import { ref, computed } from 'vue'

// This component represents one payee in the Payees view

// props 
const props = defineProps({
  payee: Object,
  incomeCategories: Object,
  expenseCategories: Object
})

// events 
const emit = defineEmits([
  'change'
])

const isExpense = ref(true)

const selectedCategoryId = ref(null)
const selectedSubcategoryId = ref(null)

const categories = computed(() => {
    return isExpense.value ? props.expenseCategories : props.incomeCategories
})

const selectedCategory = computed(() => {
    console.log('selected category id=' + selectedCategoryId.value)
    const found = categories.value.find((c) => c.id == selectedCategoryId.value)
    console.log('found ' + found)
    return found
})

const subcategories = computed(() => {
    console.log('subcategories')
    if(selectedCategory.value) {
        console.log(selectedCategory.value.subcategories)
        return selectedCategory.value.subcategories
    }
    return null
})

const selectedSubcategory = computed(() => {
    if(selectedCategory) {
        return selectedCategory.subcategories.find((s) => s.id == selectedSubcategoryId.value)
    }
    return null
})


</script>

<template>
    Name: {{ props.payee.name }}

    <div>
        <input type="checkbox" id="checkbox" v-model="isExpense" />
        <label for="checkbox">is expense</label>
    </div>
    <div>
        <label for="category">Category:</label>
        <select v-model="selectedCategoryId" name="category" id="category">
            <option v-for="c in categories" :value="c.id">{{c.name}}</option>
        </select>
    </div>
    <div>
        <label for="subcategory">Subcategory:</label>
        <select v-model="selectedSubcategoryId" name="subcategory" id="subcategory">
            <option v-for="s in subcategories" :value="s.id">{{s.name}}</option>
        </select>
    </div>
    <br/>
</template>

