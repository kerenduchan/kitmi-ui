<script setup>
import { ref, watch } from 'vue'
import TypeExpenseOrIncomeIcon from '@/components/TypeExpenseOrIncomeIcon.vue'
import SubcategoriesList from '@/components/SubcategoriesList.vue'

// props 
const props = defineProps({
    categories: Object
})

// emits
const emit = defineEmits([
    'selectedItemChanged'
])

// the selected category - v-model for the categories expansion panel
const selectedCategory = ref(null)

// either a selected category or a selected subcategory
const selectedItem = ref(null)

watch(selectedCategory, () => {
    selectedItem.value = selectedCategory.value
})

watch(selectedItem, () => {
    emit('selectedItemChanged', selectedItem.value)
})

function handleSubcategorySelected(subcategory) {
    selectedItem.value = subcategory
}
</script>

<template>
    <v-expansion-panels v-model="selectedCategory">
        <v-expansion-panel v-for="c in props.categories" :key="c.id" :value="c">
            <v-expansion-panel-title>
                <div class="category-type-icon"><TypeExpenseOrIncomeIcon :type="c.type" /></div>
                {{ c.name }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
                <SubcategoriesList 
                    :items="c.subcategories" 
                    @selectedItemChanged="handleSubcategorySelected"
                />
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<style>
.category-type-icon {
    padding-right: 10px;
}

</style>