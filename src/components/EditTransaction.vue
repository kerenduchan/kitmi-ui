<script setup>
import { ref, computed } from 'vue'
import SubcategorySelect from './SubcategorySelect.vue';
import updatePayeeSubcategory from '@/composables/mutations/updatePayeeSubcategory'
import getRef from '@/composables/getRef';

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

const subcategoryRefs = getRef()
const { subcategoryId } = subcategoryRefs

const isSaveDisabled = computed(() => {
    return subcategoryId.value === null
})

function save() {
    gqlUpdatePayeeSubcategory({
        payeeId: props.item.payee.id, 
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

const fields = ref([
    {
        label: 'Payee',
        value: props.item.payee.name
    },
    {
        label: 'Amount',
        value: props.item.formattedAmount
    },
    {
        label: 'Date',
        value: props.item.formattedDate
    }
])

</script>

<template>
    <v-card>
        <v-card-title>Edit Transaction</v-card-title>
        <v-card-text>
            <v-table>
                <tbody>
                    <tr v-for="f in fields">
                        <td>{{ f.label }}</td>
                        <td>{{ f.value }}</td>
                    </tr>
                </tbody>
            </v-table>

            <v-form>
                <SubcategorySelect 
                    :defaults="item" 
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