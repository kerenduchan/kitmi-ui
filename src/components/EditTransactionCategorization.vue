<script setup>
import { computed } from 'vue'
import SubcategorySelect from './SubcategorySelect.vue';
import subcategorySelect from '@/composables/subcategorySelect'

// props 
const props = defineProps({
    transaction: Object,
    categories: Object
})

const emit = defineEmits([
    'save',
    'close'
])

const {
    selectedCategoryId,
    selectedSubcategoryId,
    filteredCategories,
    filteredSubcategories,
    handleCategorySelected,
    handleSubcategorySelected
} = subcategorySelect(props.categories, props.transaction)

const isSubcategoryOverridden = computed(() => {
    if(props.transaction) {
        return props.transaction.overrideSubcategory
    }
    return false
})

const categorizationOverrideMsg = computed(() => {
    if(props.transaction.overrideSubcategory) {
        return "Overrides Payee's categorization (" + props.transaction.payeeCategorizationStr + ")"
    }
    return null
})

const isSaveDisabled = computed(() => {
    return selectedSubcategoryId.value === null && selectedCategoryId.value !== null
})

function save() {
    const transaction = {
        transactionId: props.transaction.id,
        subcategoryId: selectedSubcategoryId.value,
        overrideSubcategory: true,
        note: null
    }
    emit('save', transaction)
}

function handleUsePayeeSubcategory() {
    const transaction = {
        transactionId: props.transaction.id,
        subcategoryId: null,
        overrideSubcategory: false,
        note: null
    }
    emit('save', transaction)
}

</script>

<template>
    <v-card>
        <v-card-title>Categorize Transaction</v-card-title>
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

                <div v-if="isSubcategoryOverridden">
                <p>{{ categorizationOverrideMsg }}</p>
                <v-btn @click="handleUsePayeeSubcategory">Use Payee Subcategory</v-btn>
            </div>
 
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" :disabled="isSaveDisabled" @click="save">Save</v-btn>
            <v-btn color="primary" @click="emit('close')">Close</v-btn>
            
        </v-card-actions>
    </v-card>
</template>