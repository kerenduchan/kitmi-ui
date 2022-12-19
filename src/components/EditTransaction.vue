<script setup>
import { ref, computed } from 'vue'
import SubcategorySelect from './SubcategorySelect.vue';
import TransactionSubcategorySaveOptions from '@/components/TransactionSubcategorySaveOptions.vue'

// props 
const props = defineProps({
    item: Object,
    categories: Object
})

const emit = defineEmits([
    'close',
    'payeeChanged',
    'transactionChanged'
])

const subcategoryId = ref(props.item.subcategoryId)


function handleSubcategorySelected(id) {
    subcategoryId.value = id
}

const isSaveDisabled = computed(() => {
    return subcategoryId.value === null
})

const showTransactionSubcategorySaveOptionsDialog = ref(false)

function save() {
    showTransactionSubcategorySaveOptionsDialog.value = true
}

function handlePayeeChange() {
    showTransactionSubcategorySaveOptionsDialog.value = false
    emit('payeeChanged')
}

function handleTransactionChange() {
    showTransactionSubcategorySaveOptionsDialog.value = false
    emit('transactionChanged')
}

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
                    @subcategorySelected="handleSubcategorySelected"
                />
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" :disabled="isSaveDisabled" @click="save">Save</v-btn>
            <v-btn color="primary" @click="close">Close</v-btn>
            
        </v-card-actions>
    </v-card>

    <!-- Dialog for choosing whether to save subcategory on payee or on transaction -->
    <v-dialog v-model="showTransactionSubcategorySaveOptionsDialog">
        <TransactionSubcategorySaveOptions
            :item="item"
            :subcategoryId="subcategoryId"
            @close="showTransactionSubcategorySaveOptionsDialog = false"
            @payeeChanged="handlePayeeChange" 
            @transactionChanged="handleTransactionChange" 
        />
    </v-dialog>
</template>