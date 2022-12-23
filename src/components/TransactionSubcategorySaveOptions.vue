<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    transaction: Object,
    subcategoryId: String
})

const emit = defineEmits([
    'saveOnPayee',
    'saveOnTransaction',
    'close'
])

function save() {
    emit(isApplyToPayee.value ? 'saveOnPayee' : 'saveOnTransaction')
}

const isApplyToPayee = ref(true)

const payeeLabel = computed(() => {
    return 'Apply the changes to the payee (' + props.transaction.payee.name + ')'
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
            <v-btn color="primary" @click="emit('close')">Cancel</v-btn>
            
        </v-card-actions>
    </v-card>
    </template>