<script setup>
import { computed } from 'vue'
import SubcategorySelect from './SubcategorySelect.vue';
import subcategorySelect from '@/composables/subcategorySelect'

// props 
const props = defineProps({
    payee: Object,
    categories: Object
})

const emit = defineEmits([
    'close',
    'save'
])
const {
    selectedCategoryId,
    selectedSubcategoryId,
    filteredCategories,
    filteredSubcategories,
    handleCategorySelected,
    handleSubcategorySelected
} = subcategorySelect(props.categories, props.payee)

const isSaveDisabled = computed(() => {
    return selectedSubcategoryId.value === null
})

function save() {
    const payee = { 
        subcategoryId: selectedSubcategoryId.value
    }
    emit('save', payee)
}

</script>

<template>
    <v-card>
        <v-card-title>{{ props.payee.name }}</v-card-title>
        <v-card-text>
            <v-form>
                <SubcategorySelect 
                    :categoryId="selectedCategoryId"
                    :subcategoryId="selectedSubcategoryId"
                    :categories="filteredCategories"
                    :subcategories="filteredSubcategories"
                    @categorySelected="handleCategorySelected"
                    @subcategorySelected="handleSubcategorySelected"
                />
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" :disabled="isSaveDisabled" @click="save">Save</v-btn>
            <v-btn color="primary" @click="emit('close')">Close</v-btn>
            
        </v-card-actions>
    </v-card>
</template>