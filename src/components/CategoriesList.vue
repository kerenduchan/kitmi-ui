<script setup>
import { ref, watchEffect } from 'vue'
import SubcategoriesList from '@/components/SubcategoriesList.vue';
import TypeIcon from '@/components/TypeIcon.vue'

// props 
const props = defineProps({
    selectedCategoryId: String,
    selectedSubcategoryId: String,
    categories: Object
})

// emits
const emit = defineEmits([
    'selectCategory',
    'selectSubcategory'
])

const expansionPanelModel = ref(null)

function handleSubcategorySelected(subcategoryId) {
    emit('selectSubcategory', subcategoryId)
}

function handleExpansionPanelClicked() {
    emit('selectCategory', expansionPanelModel.value)
}

watchEffect(() => {
    if(props.selectedCategoryId !== expansionPanelModel.value) {
        expansionPanelModel.value = props.selectedCategoryId
    }
})

</script>

<template>
    <v-expansion-panels class="pa-4" v-model="expansionPanelModel">

        <!-- Category -->
        <v-expansion-panel v-for="c in categories" :value="c.id">
            <v-expansion-panel-title @click="handleExpansionPanelClicked()">
                <span class="category-type-icon">
                    <TypeIcon :type="c.type" :isExcluded="c.excludeFromReports"/>
                </span>
                {{ c.name }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
                <!-- Subcategories of the current category -->
                <SubcategoriesList
                    :selectedSubcategoryId="selectedSubcategoryId"
                    :subcategories="c.subcategories"
                    @select="handleSubcategorySelected"
                />
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>

</template>

<style>
.category-type-icon {
    padding-right: 10px;
}
</style>