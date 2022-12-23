<script setup>
import { ref, computed } from 'vue'
import SubcategorySelect from './SubcategorySelect.vue';
import TransactionSubcategorySaveOptions from '@/components/TransactionSubcategorySaveOptions.vue'
import updateTransactionSubcategory from '@/composables/mutations/updateTransactionSubcategory'
import subcategorySelect from '@/composables/subcategorySelect'

const { 
    gqlUpdateTransactionSubcategory, 
    onDone: onUpdateTransactionDone, 
    onError: onUpdateTransactionError 
} = updateTransactionSubcategory()

// props 
const props = defineProps({
    transaction: Object,
    categories: Object
})

const emit = defineEmits([
    'close',
    'payeeChanged',
    'transactionChanged'
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
        return props.transaction.overridingSubcategory !== null
    }
    return false
})

const isSaveDisabled = computed(() => {
    return selectedSubcategoryId.value === null
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
        value: props.transaction.payee.name
    },
    {
        label: 'Amount',
        value: props.transaction.formattedAmount
    },
    {
        label: 'Date',
        value: props.transaction.formattedDate
    }
])

function usePayeeSubcategory() {
    // set the subcategoryId of the transaction to null
    gqlUpdateTransactionSubcategory({
        transactionId: props.transaction.id, 
        subcategoryId: null
    })
}

onUpdateTransactionDone(() => {
    emit('transactionChanged')
})

onUpdateTransactionError((e) => {
    console.error('failed to update transaction')
    console.error(e)
})

const payeeCategorization = computed(() => {
    if(!props.transaction.payee.subcategory) {
        return 'Uncategorized'
    }
    return props.transaction.payee.categoryName + ': ' + props.transaction.payee.subcategoryName
})

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

            <SubcategorySelect 
                    :categoryId="selectedCategoryId"
                    :subcategoryId="selectedSubcategoryId"
                    :categories="filteredCategories"
                    :subcategories="filteredSubcategories"
                    @categorySelected="handleCategorySelected"
                    @subcategorySelected="handleSubcategorySelected"
                />

            <div v-if="isSubcategoryOverridden">
                <p>The categorization for this transaction overrides the categorization of the payee ({{ payeeCategorization }})</p>
                <v-btn @click="usePayeeSubcategory">Use Payee Subcategory</v-btn>
            </div>
            
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" :disabled="isSaveDisabled" @click="save">Save</v-btn>
            <v-btn color="primary" @click="close">Close</v-btn>
            
        </v-card-actions>
    </v-card>

    <!-- Dialog for choosing whether to save subcategory on payee or on transaction -->
    <v-dialog v-model="showTransactionSubcategorySaveOptionsDialog">
        <TransactionSubcategorySaveOptions
            :transaction="transaction"
            :subcategoryId="selectedSubcategoryId"
            @close="showTransactionSubcategorySaveOptionsDialog = false"
            @payeeChanged="handlePayeeChange" 
            @transactionChanged="handleTransactionChange" 
        />
    </v-dialog>
</template>