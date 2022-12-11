<script setup>
import { ref, computed } from 'vue'
import updatePayeeSubcategory from '../composables/updatePayeeSubcategory'

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

const { gqlUpdatePayeeSubcategory, onDone, onError } = updatePayeeSubcategory()

const isExpense = ref(true)

const selectedCategoryId = ref(null)
const selectedSubcategoryId = ref(null)

const categories = computed(() => {
    return isExpense.value ? props.expenseCategories : props.incomeCategories
})

const selectedCategory = computed(() => {
    const found = categories.value.find((c) => c.id == selectedCategoryId.value)
    return found
})

const subcategories = computed(() => {
    if(selectedCategory.value) {
        return selectedCategory.value.subcategories
    }
    return null
})

function save() {
    if(selectedSubcategoryId.value === null) {
        return
    }
    
    gqlUpdatePayeeSubcategory({
        payeeId: props.payee.id,
        subcategoryId: selectedSubcategoryId.value
    }) 
}

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
    <button @click="save">Save</button>
    <br/>
</template>

