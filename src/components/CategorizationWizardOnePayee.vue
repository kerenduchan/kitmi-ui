<script setup>
import { ref, watch, computed } from 'vue'
import { formatNumber, formatDate } from '@/composables/utils'
import TypeIcon from '@/components/TypeIcon.vue'
import TransactionsListForPayee from '@/components/TransactionsListForPayee.vue'

// props 
const props = defineProps({
    payee: Object,
    transactions: Object,
    categories: Object
})

// emits
const emit = defineEmits([
    'subcategorySelected',
])

// Index in the categories array of the selected category.
// v-model for the categories v-item-group.
const selectedCategoryIdx = ref(getCategoryIdxById(props.payee.categoryId))

// The selected category
const selectedCategory = computed(() => {
    if (selectedCategoryIdx.value === null) {
        return null
    }
    return props.categories[selectedCategoryIdx.value]
})

// the subcategories of the selected category
const subcategories = computed(() => {
    if (selectedCategory.value === null) {
        return null
    }
    return selectedCategory.value.subcategories
})

// Index in the subcategories array on the selected category.
// v-model for the subcategories v-item-group.
const selectedSubcategoryIdx = ref(getSubcategoryIdxById(props.payee.subcategoryId))

// The selected subcategory
const selectedSubcategory = computed(() => {
    if (selectedSubcategoryIdx.value === null) {
        return null
    }
    return subcategories.value[selectedSubcategoryIdx.value]
})

// get the index in the categories array of the category with the given ID
function getCategoryIdxById(categoryId) {
    if (categoryId === null) {
        return null
    }
    const foundIdx = props.categories.findIndex(c => c.id === categoryId)
    return foundIdx === -1 ? null : foundIdx
}

// get the index in the subcategories array of the category with the given ID
function getSubcategoryIdxById(subcategoryId) {
    if (subcategoryId === null) {
        return null
    }
    const foundIdx = subcategories.value.findIndex(s => s.id === subcategoryId)
    return foundIdx === -1 ? null : foundIdx
}


watch(selectedCategoryIdx, () => {
    if (selectedCategoryIdx.value === null) {
        // The selected category has been deselected. Clear the selected category.
        clearSelectedCategory()
    }
    // The selected category has changed. Reset the selected subcategory.
    selectedSubcategoryIdx.value = null
})

watch(selectedSubcategoryIdx, () => {
    if (selectedSubcategoryIdx.value === null) {
        // The selected subcategory has been deselected. Clear the selected subcategory.
        clearSelectedSubcategory()
    }
    if (selectedSubcategory.value !== null) {
        // The selected subcategory has changed. Emit 'subcategorySelected'
        setTimeout(() => { emit('subcategorySelected', selectedSubcategory.value.id) }, 400)
        
    }
})

const showCategorySelect = computed(() => {
    // show the category selection item group 
    // if a category is not selected
    return selectedCategoryIdx.value === null
})

const showSubcategorySelect = computed(() => {
    // show the subcategory selection item group 
    // if a category is selected and a subcategory is not selected
    return selectedCategoryIdx.value !== null && selectedSubcategoryIdx.value === null
})

function clearSelectedCategory() {
    selectedCategoryIdx.value = null
}

function clearSelectedSubcategory() {
    selectedSubcategoryIdx.value = null
}

</script>

<template>
    <v-card height="100%">
        <v-card-title>{{ payee.name }}</v-card-title>
        <v-card-text>

            <!-- the transactions associated with this payee -->
            <v-expansion-panels>
                <v-expansion-panel>
                    <v-expansion-panel-title>
                        Last Transaction: {{ formatNumber(transactions[0].amount) }} at {{ formatDate(transactions[0].date) }}
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <TransactionsListForPayee :transactions="props.transactions" />
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
                    <a @click="clearSelectedCategory">
                        {{ selectedCategory.name }}
                    </a>
                </span>
                <span v-if="selectedSubcategory !== null">
                    >
                    <a @click="clearSelectedSubcategory">{{ selectedSubcategory.name }}</a>
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
                                        <v-card-title>
                                            <TypeIcon :type="c.type" />
                                            {{ c.name }}
                                        </v-card-title>
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
                            <v-col cols="4" v-for="s in subcategories" :key="s.id">
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