<script setup>
import { ref, watch, computed } from 'vue'
import TransactionsListForPayee from '@/components/TransactionsListForPayee.vue'

// props 
const props = defineProps({
    item: Object,
    transactions: Object,
    categories: Object
})

// emits
const emit = defineEmits([
    'subcategorySelected',
])

// v-model for the categories v-item-group - index in the categories array
const selectedCategoryIdx = ref(getCategoryIdxById(props.item.categoryId))

// v-model for the subcategories v-item-group - 
// index in the subcategories array on the selected category
const selectedSubcategoryIdx = ref(getSubcategoryIdxById(props.item.subcategoryId))

function getCategoryIdxById(categoryId) {
    if (categoryId === null) {
        return null
    }
    const foundIdx = props.categories.findIndex(c => c.id === categoryId)
    return foundIdx !== null ? foundIdx : null
}

function getSubcategoryIdxById(subcategoryId) {
    if (subcategoryId === null) {
        return null
    }
    const selectedCategory = getSelectedCategory()
    const foundIdx = selectedCategory.subcategories.findIndex(s => s.id === subcategoryId)
    return foundIdx !== null ? foundIdx : null
}

function getSelectedCategory() {
    if (selectedCategoryIdx.value === null) {
        return null
    }
    return props.categories[selectedCategoryIdx.value]
}

const selectedSubcategory = computed(() => {
    if (selectedSubcategoryIdx.value === null) {
        return null
    }
    return props.categories[selectedCategoryIdx.value].subcategories[selectedSubcategoryIdx.value]
})

watch(selectedCategoryIdx, () => {
    if (selectedCategoryIdx.value === undefined) {
        selectedCategoryIdx.value = null
    }
    selectedSubcategoryIdx.value = null
})

watch(selectedSubcategoryIdx, () => {
    if (selectedSubcategoryIdx.value === undefined) {
        selectedSubcategoryIdx.value = null
    }
    if (selectedSubcategoryIdx.value !== null) {
        const selectedCategory = getSelectedCategory()
        const selectedSubcategoryId = selectedCategory.subcategories[selectedSubcategoryIdx.value].id
        emit('subcategorySelected', selectedSubcategoryId)
    }
})

const showSubcategorySelect = computed(() => {
    return selectedCategoryIdx.value !== null && selectedSubcategoryIdx.value === null
})

const showCategorySelect = computed(() => {
    return selectedCategoryIdx.value === null
})

function resetCategory() {
    selectedCategoryIdx.value = null
}

function resetSubcategory() {
    selectedSubcategoryIdx.value = null
}

</script>

<template>
    <v-card height="500px">
        <v-card-title>{{ item.name }}</v-card-title>
        <v-card-text>
            <v-expansion-panels width="300px">
                <v-expansion-panel>
                    <v-expansion-panel-title>
                        Transactions
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <TransactionsListForPayee :items="props.transactions" />
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>

            <!-- the "breadcrumbs" of the selected category and subcategory -->
            <div class="pt-3">
                Categorization:
                <span v-if="selectedCategoryIdx === null">
                    Uncategorized
                </span>
                <span v-else>
                    <a @click="resetCategory">
                        {{ getSelectedCategory().name }}
                    </a>
                </span>
                <span v-if="selectedSubcategory !== null">
                    >
                    <a @click="resetSubcategory">{{ selectedSubcategory.name }}</a>
                </span>
            </div>

            <!-- category select -->
            <div class="pt-3" v-if="showCategorySelect">
                <div>Category:</div>
                <v-item-group v-model="selectedCategoryIdx">
                    <v-container>
                        <v-row>
                            <v-col cols="4" v-for="c in categories" :key="c.id">
                                <v-item v-slot="{ isSelected, toggle }">
                                    <v-card :color="isSelected ? 'primary' : ''" class="d-flex align-center"
                                        @click="toggle">
                                        <v-card-title>{{ c.name }}</v-card-title>
                                    </v-card>
                                </v-item>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-item-group>
            </div>

            <!-- subcategory select -->
            <div class="pt-3" v-if="showSubcategorySelect">
                Subcategory:
                <v-item-group v-model="selectedSubcategoryIdx">
                    <v-container>
                        <v-row>
                            <v-col cols="4" v-for="s in getSelectedCategory().subcategories" :key="s.id">
                                <v-item v-slot="{ isSelected, toggle }">
                                    <v-card :color="isSelected ? 'primary' : ''" class="d-flex align-center"
                                        @click="toggle">
                                        <v-card-title>{{ s.name }}</v-card-title>
                                    </v-card>
                                </v-item>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-item-group>
            </div>
        </v-card-text>
    </v-card>
</template>

<style>
a {
    text-decoration: underline;
    color: blue;
}
</style>