<script setup>
import { computed } from 'vue'
import SubcategorySelect from './SubcategorySelect.vue';
import updatePayeeSubcategory from '@/composables/mutations/updatePayeeSubcategory'
import subcategorySelect from '@/composables/subcategorySelect';

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

const subcategoryRefs = subcategorySelect()
const { categoryId, subcategoryId } = subcategoryRefs

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

</script>

<template>
    <v-card>
        <v-card-title>{{ props.item.name }}</v-card-title>
        <v-card-text>
            <v-form>
                <SubcategorySelect 
                    :item="item" 
                    :categories="categories"
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