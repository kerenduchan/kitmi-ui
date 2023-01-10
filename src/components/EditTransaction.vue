<script setup>
import { ref, computed, watch } from 'vue'
import SubcategorySelect from './SubcategorySelect.vue'
import subcategorySelect from '@/composables/subcategorySelect'

// props 
const props = defineProps({
    transaction: Object,
    categories: Object
})

const emit = defineEmits([
    'close',
    'save',
])

// note (v-model for v-text-field)
const note = ref(props.transaction.note)

// Whether or not to override the payee's subcategory (v-model for v-switch)
const overrideSubcategory = ref(props.transaction.overrideSubcategory)

// select overriding category and subcategory
const {
    selectedCategoryId,
    selectedSubcategoryId,
    filteredCategories,
    filteredSubcategories,
    handleCategorySelected,
    handleSubcategorySelected
} = subcategorySelect(props.categories, props.transaction)

// whether or not the save button should be disabled
const isSaveDisabled = computed(() => {
    return selectedSubcategoryId.value === null && selectedCategoryId.value !== null
})

function save() {
    const transaction = {
        transactionId: props.transaction.id,
        subcategoryId: selectedSubcategoryId.value,
        overrideSubcategory: overrideSubcategory.value,
        note: note.value
    }
    emit('save', transaction)
}

// read-only fields of the transaction
const fields = computed(() => {
    return [
        {
            label: 'ID',
            value: props.transaction.id
        },
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
        },
        {
            label: 'Account',
            value: props.transaction.account.name
        },
    ]
})

const overrideSubcategoryLabel = computed(() => {
    return "Override Payee's Categorization (" + props.transaction.payeeCategorizationStr + ")"
})

</script>

<template>
    <v-card>
        <v-card-title>Transaction Details</v-card-title>
        <v-card-text>

            <!-- Read-only fields (ID, amount, etc)-->
            <v-table density="compact">
                <tbody>
                    <tr v-for="f in fields">
                        <td>{{ f.label }}</td>
                        <td>{{ f.value }}</td>
                        <td></td>
                    </tr>
                </tbody>
            </v-table>

            <!-- Note -->
            <v-text-field 
                label="Note"
                clearable
                v-model="note" 
            />

            <!-- Switch for overriding the payee's category and subcategory -->
            <v-switch 
                :label="overrideSubcategoryLabel"
                v-model="overrideSubcategory">
            </v-switch>

            <!-- The overriden category and subcategory (show only if overridden) -->
            <SubcategorySelect v-if="overrideSubcategory"
                :categoryId="selectedCategoryId"
                :subcategoryId="selectedSubcategoryId"
                :categories="filteredCategories"
                :subcategories="filteredSubcategories"
                @categorySelected="handleCategorySelected"
                @subcategorySelected="handleSubcategorySelected"
            />

        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" :disabled="isSaveDisabled" @click="save">Save</v-btn>            
            <v-btn color="primary" @click="emit('close')">Close</v-btn>
        </v-card-actions>
    </v-card>
</template>