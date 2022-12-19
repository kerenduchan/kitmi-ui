<script setup>
import { ref, computed } from 'vue'
import updatePayeeSubcategory from '@/composables/mutations/updatePayeeSubcategory'
import updateTransactionSubcategory from '@/composables/mutations/updateTransactionSubcategory'

const props = defineProps({
    item: Object,
    subcategoryId: String
})

const emit = defineEmits([
    'save',
    'close'
])

const { 
    gqlUpdatePayeeSubcategory, 
    onDone: onUpdatePayeeDone, 
    onError: onUpdatePayeeError 
} = updatePayeeSubcategory()

const { 
    gqlUpdateTransactionSubcategory, 
    onDone: onUpdateTransactionDone, 
    onError: onUpdateTransactionError 
} = updateTransactionSubcategory()

function save() {
    if(isApplyToPayee.value === true) {
        saveOnPayee()
    } else {
        saveOnTransaction()
    }
    emit('save')
}

function close() {
    emit('close')
}

onUpdatePayeeDone(() => {
    emit('save')
})

onUpdatePayeeError((e) => {
    console.error('failed to update payee')
    console.error(e)
})

function saveOnPayee() {

    gqlUpdateTransactionSubcategory({
        transactionId: props.item.id, 
        subcategoryId: null
    })

    gqlUpdatePayeeSubcategory({
        payeeId: props.item.payee.id, 
        subcategoryId: props.subcategoryId
    })
}

function saveOnTransaction() {
    gqlUpdateTransactionSubcategory({
        transactionId: props.item.id, 
        subcategoryId: props.subcategoryId
    })
}

onUpdateTransactionDone(() => {
    if(!isApplyToPayee) {
        emit('save')
    }
})

onUpdateTransactionError((e) => {
    console.error('failed to update transaction')
    console.error(e)
})

const isApplyToPayee = ref(true)

const payeeLabel = computed(() => {
    return 'Apply the changes to the payee (' + props.item.payee.name + ')'
})

</script>


<template>
    <v-card>
        <v-card-title>Save Transaction</v-card-title>
        <v-card-text>            
            <v-form>
                <v-radio-group v-model="isApplyToPayee">
                    <v-radio :value="true" :label="payeeLabel"></v-radio>
                    <v-radio :value="false" label="Apply the changes only to this transaction (override the payee)"></v-radio>
                </v-radio-group>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" @click="save">Save</v-btn>
            <v-btn color="primary" @click="close">Cancel</v-btn>
            
        </v-card-actions>
    </v-card>
    </template>