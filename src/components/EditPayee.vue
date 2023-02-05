<script setup>
import { ref, computed } from 'vue'
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
    return selectedSubcategoryId.value === null && selectedCategoryId.value !== null
})

const note = ref(props.payee.note)

function save() {
    const params = { 
        payeeId: props.payee.id,
        subcategoryId: selectedSubcategoryId.value,
        note: note.value
    }
    emit('save', props.payee, params)
}

</script>

<template>
    <v-card v-if="payee">
        <v-card-title>{{ props.payee.name }}</v-card-title>
        <v-card-text>
            <v-form>

                <!-- Category and subcategory -->
                <SubcategorySelect 
                    :categoryId="selectedCategoryId"
                    :subcategoryId="selectedSubcategoryId"
                    :categories="filteredCategories"
                    :subcategories="filteredSubcategories"
                    @categorySelected="handleCategorySelected"
                    @subcategorySelected="handleSubcategorySelected"
                />

                <!-- Note -->
                <v-text-field 
                    label="Note" 
                    v-model="note" 
                />

            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" :disabled="isSaveDisabled" @click="save">Save</v-btn>
            <v-btn color="primary" @click="emit('close')">Close</v-btn>
            
        </v-card-actions>
    </v-card>
</template>