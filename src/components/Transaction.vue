<script setup>
import { computed } from 'vue'
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

</script>

<template>
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
</template>

