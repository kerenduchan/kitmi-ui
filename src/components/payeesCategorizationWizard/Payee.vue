<script setup>
import Transactions from './Transactions.vue'
import Categorization from './Categorization.vue'

const props = defineProps({
    payee: Object,
    categories: Object
})

const emit = defineEmits([
    'categorySelected',
    'subcategorySelected'
])

function handleCategorySelected(categoryId) {
    emit('categorySelected', categoryId)
}

function handleSubcategorySelected(subcategoryId) {
    emit('subcategorySelected', subcategoryId)
}

</script>

<template>
    <v-card variant="outlined" class="flex-grow-1 d-flex flex-column">
        <v-card-title>
            <div v-if="payee">{{ payee.name }}</div>
        </v-card-title>
        <v-card-text class="d-flex flex-column overflow-y-hidden">
            <Transactions :transactions="payee.transactions" :payeeName="payee.name"/>
            <Categorization :payee="payee" :categories="categories"
                @categorySelected="handleCategorySelected" @subcategorySelected="handleSubcategorySelected" />
        </v-card-text>
    </v-card>

</template>