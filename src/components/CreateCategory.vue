<script setup>
import { ref, computed } from 'vue'
import SubcategorySelect from './SubcategorySelect.vue';
import getRef from '@/composables/getRef';

// props 
const props = defineProps({
    categories: Object
})

const emit = defineEmits([
    'close',
    'change'
])

const defaults = ref({
    isExpense: true,
    categoryId: null,
    subcategoryId: null
})


const subcategoryRefs = getRef()
const { subcategoryId } = subcategoryRefs

const isSaveDisabled = computed(() => {
    return subcategoryId.value === null
})

function save() {
    console.log('save')
}

function close() {
    emit('close')
}

</script>

<template>
    <v-card>
        <v-card-title>Create Category</v-card-title>
        <v-card-text>
            <v-form>
                <SubcategorySelect 
                    :defaults="defaults" 
                    :categories="categories"
                    :showExpenseCategoriesFirst="true"
                    :refs="subcategoryRefs"
                />
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" :disabled="isSaveDisabled" @click="save">Save</v-btn>
            <v-btn color="primary" @click="close">Close</v-btn>
            
        </v-card-actions>
    </v-card>
</template>