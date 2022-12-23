<script setup>
import { ref, computed } from 'vue'
import SubcategorySelect from './SubcategorySelect.vue';
import updatePayeeSubcategory from '@/composables/mutations/updatePayeeSubcategory'
import subcategorySelect from '@/composables/subcategorySelect'

// props 
const props = defineProps({
    payee: Object,
    categories: Object
})

const emit = defineEmits([
    'close',
    'change'
])
const {
    selectedCategoryId,
    selectedSubcategoryId,
    filteredCategories,
    filteredSubcategories,
    handleCategorySelected,
    handleSubcategorySelected
} = subcategorySelect(props.categories, props.payee)

const { 
    gqlUpdatePayeeSubcategory, 
    onDone: onUpdatePayeeDone, 
    onError: onUpdatePayeeError 
} = updatePayeeSubcategory()

const isSaveDisabled = computed(() => {
    return selectedSubcategoryId.value === null
})

function save() {
    gqlUpdatePayeeSubcategory({
        payeeId: props.payee.id, 
        subcategoryId: selectedSubcategoryId.value
    })
}

onUpdatePayeeDone(() => {
    emit('change')
})

onUpdatePayeeError((e) => {
    console.error('failed to update payee')
    console.error(e)
})

function close() {
    emit('close')
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
            <v-btn color="primary" @click="close">Close</v-btn>
            
        </v-card-actions>
    </v-card>
</template>