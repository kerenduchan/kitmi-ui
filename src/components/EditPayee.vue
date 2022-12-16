<script setup>
import { ref, computed } from 'vue'
import SubcategorySelect from './SubcategorySelect.vue';
import updatePayeeSubcategory from '@/composables/mutations/updatePayeeSubcategory'

// props 
const props = defineProps({
    item: Object,
    categories: Object
})

const emit = defineEmits([
    'close',
    'change'
])

const { 
    gqlUpdatePayeeSubcategory, 
    onDone: onUpdatePayeeDone, 
    onError: onUpdatePayeeError 
} = updatePayeeSubcategory()

// The selected type (Income/Expense)
const type = ref(null)

// The selected category ID
const categoryId = ref(null)

// The selected subcategory ID
const subcategoryId = ref(null)

const isSaveDisabled = computed(() => {
    return (categoryId === null || subcategoryId.value === null)
})

function save() {
    gqlUpdatePayeeSubcategory({
        payeeId: props.item.id, 
        subcategoryId: subcategoryId.value
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

function handleSubcategorySelectChange({ 
    type: iType, 
    categoryId: iCategoryId, 
    subcategoryId: iSubcategoryId}) {
    console.log('handleSubcategorySelectChange')
    type.value = iType
    categoryId.value = iCategoryId
    subcategoryId.value = iSubcategoryId
}

</script>

<template>
    <v-card>
        <v-card-title>{{ props.item.name }}</v-card-title>
        <v-card-text>
            <v-form>
                <SubcategorySelect 
                    :item="item" 
                    :categories="categories"
                    @change="handleSubcategorySelectChange"
                />
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" :disabled="isSaveDisabled" @click="save">Save</v-btn>
            <v-btn color="primary" @click="close">Close</v-btn>
            
        </v-card-actions>
    </v-card>
</template>