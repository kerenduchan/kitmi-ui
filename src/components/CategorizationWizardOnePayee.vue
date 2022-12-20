<script setup>
import { ref, watch } from 'vue'

// props 
const props = defineProps({
    item: Object,
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
    if(categoryId === null) {
        return null
    }
    const foundIdx = props.categories.findIndex(c => c.id === categoryId)
    return foundIdx !== null ? foundIdx : null
}

function getSubcategoryIdxById(subcategoryId) {
    if(subcategoryId === null) {
        return null
    }
    const selectedCategory = getSelectedCategory()
    const foundIdx = selectedCategory.subcategories.findIndex(s => s.id === subcategoryId)
    return foundIdx !== null ? foundIdx : null
}

function getSelectedCategory() {
    if(selectedCategoryIdx.value === null) {
        return null
    }
    return props.categories[selectedCategoryIdx.value]
}

watch(selectedCategoryIdx, () => {
    selectedSubcategoryIdx.value = null
})

watch(selectedSubcategoryIdx, () => {
    if(selectedSubcategoryIdx.value !== null) {
        const selectedCategory = getSelectedCategory()
        const selectedSubcategoryId = selectedCategory.subcategories[selectedSubcategoryIdx.value].id
        emit('subcategorySelected', selectedSubcategoryId)    
    }
})

</script>

<template>
    <v-card>
        <v-card-title>{{ item.name }}</v-card-title>
        <v-card-text>
            Category:
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

            <v-divider />

            <div v-if="selectedCategoryIdx !== null">
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