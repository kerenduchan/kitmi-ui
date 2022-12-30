<script setup>
import { ref, computed } from 'vue'
import SubcategorySelect from './SubcategorySelect.vue';
import TransactionSubcategorySaveOptions from '@/components/TransactionSubcategorySaveOptions.vue'
import subcategorySelect from '@/composables/subcategorySelect'

// props 
const props = defineProps({
    transaction: Object,
    categories: Object
})

const emit = defineEmits([
    'close',
    'saveOnPayee',
    'saveOnTransaction',
])

const {
    selectedCategoryId,
    selectedSubcategoryId,
    filteredCategories,
    filteredSubcategories,
    handleCategorySelected,
    handleSubcategorySelected
} = subcategorySelect(props.categories, props.transaction, props.transaction.amount <= 0)

const isSubcategoryOverridden = computed(() => {
    if(props.transaction) {
        return props.transaction.overrideSubcategory
    }
    return false
})

const isSaveDisabled = computed(() => {
    return selectedSubcategoryId.value === null && selectedCategoryId.value !== null
})

const showTransactionSubcategorySaveOptionsDialog = ref(false)

function save() {
    showTransactionSubcategorySaveOptionsDialog.value = true
}

function handleSaveOnPayee() {
    showTransactionSubcategorySaveOptionsDialog.value = false
    const payee = {
        payeeId: props.transaction.payee.id,
        subcategoryId: selectedSubcategoryId.value
    }
    emit('saveOnPayee', payee)
}

function handleSaveOnTransaction() {
    showTransactionSubcategorySaveOptionsDialog.value = false
    const transaction = {
        transactionId: props.transaction.id,
        overrideSubcategory: true,
        subcategoryId: selectedSubcategoryId.value
    }
    emit('saveOnTransaction', transaction)
}

function handleUsePayeeSubcategory() {
    const transaction = {
        transactionId: props.transaction.id,
        overrideSubcategory: false,
        subcategoryId: null
    }
    emit('saveOnTransaction', transaction)
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
                <v-btn @click="handleUsePayeeSubcategory">Use Payee Subcategory</v-btn>
            </div>
            
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" :disabled="isSaveDisabled" @click="save">Save</v-btn>
            <v-btn color="primary" @click="emit('close')">Close</v-btn>
            
        </v-card-actions>
    </v-card>

    <!-- Dialog for choosing whether to save subcategory on payee or on transaction -->
    <v-dialog v-model="showTransactionSubcategorySaveOptionsDialog">
        <TransactionSubcategorySaveOptions
            :transaction="transaction"
            :subcategoryId="selectedSubcategoryId"
            @close="showTransactionSubcategorySaveOptionsDialog = false"
            @saveOnPayee="handleSaveOnPayee" 
            @saveOnTransaction="handleSaveOnTransaction" 
        />
    </v-dialog>
</template>