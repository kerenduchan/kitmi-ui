<script setup>
import Transactions from './Transactions.vue'
import Categorization from './Categorization.vue'

const props = defineProps({
    payeeDraft: Object,
    categories: Object
})

const emit = defineEmits([
    'categorySelected',
    'subcategorySelected'
])

function handleCategorySelected(category) {
    emit('categorySelected', category)
}

function handleSubcategorySelected(subcategory) {
    emit('subcategorySelected', subcategory)
}

</script>

<template>
    <v-card variant="outlined" class="flex-grow-1 d-flex flex-column">
        <v-card-title>
            <div v-if="payeeDraft">{{ payeeDraft.payee.name }}</div>
        </v-card-title>
        <v-card-text class="d-flex flex-column overflow-y-hidden">
            <Transactions :transactions="payeeDraft.payee.transactions" />
            <Categorization :payeeDraft="payeeDraft" :categories="categories"
                @categorySelected="handleCategorySelected" @subcategorySelected="handleSubcategorySelected" />
        </v-card-text>
    </v-card>

</template>