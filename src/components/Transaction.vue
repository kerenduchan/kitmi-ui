<script setup>
import { computed, onMounted } from 'vue'
// This component represents one transaction in the Transactions view

// props 
const props = defineProps({
    transaction: Object,
    incomeCategories: Object,
    expenseCategories: Object
})

// events 
const emit = defineEmits([
    'change'
])

const subcategory = computed(() => {
    const t = props.transaction
    if (t.subcategory) {
        return t.subcategory
    }
    return t.payee.subcategory
    
})

const category = computed(() => {
    if (subcategory.value) {
        return subcategory.value.category
    }
    return null
})

const categoryName = computed(() => category.value ? category.value.name : '')
const subcategoryName = computed(() => subcategory.value ? subcategory.value.name : '')

onMounted(() => { console.log(props.transaction)})
</script>

<template>
    <v-container>
        <v-row>
            <v-col>Date</v-col>
            <v-col>Amount</v-col>
            <v-col>Payee</v-col>
            <v-col>Account</v-col>
            <v-col>Category</v-col>
            <v-col>Subcategory</v-col>
        </v-row>
        <v-row>
            <v-col>
                {{ props.transaction.date }}
            </v-col>
            <v-col>
                {{ props.transaction.amount }}
            </v-col>
            <v-col>
                {{ props.transaction.payee.name }}
            </v-col>
            <v-col>
                {{ props.transaction.account.name }}
            </v-col>
            <v-col>
                {{ categoryName }}
            </v-col>
            <v-col>
                {{ subcategoryName }}
            </v-col>
            <v-col>
            </v-col>
        </v-row>
    </v-container>
</template>

