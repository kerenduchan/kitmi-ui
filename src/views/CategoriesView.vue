<script setup>
import { ref } from 'vue'
import CategoriesList from '@/components/CategoriesList.vue'
import getCategories from '@/composables/queries/getCategories'

const { categories, isReady, refetch } = getCategories()

const selectedItem = ref(null)

function handleSelectedItemChanged(item) {
    console.log('selected item changed ' + item.name)
    selectedItem.value = item
}

function handleEditClicked() {
    console.log('handleEditClicked')
}

function handleCreateCategoryClicked() {
    console.log('handleCreateCategoryClicked')
}

function handleDeleteClicked() {
    console.log('handleDeleteClicked')
}

function handleCreateSubcategoryClicked() {
    console.log('handleCreateSubcategoryClicked')
}

</script>

<template>
    <div class="top-bar">
        <div class="top-bar-left">
            <div class="top-bar-action">
                <!-- Edit button -->
                <v-btn 
                    icon="mdi-pencil" 
                    @click="handleEditClicked">
                </v-btn>
            </div>
            <div class="top-bar-action">
                <!-- Add subcategory button -->
                <v-btn 
                    icon="mdi-plus" 
                    @click="handleCreateSubcategoryClicked">
                </v-btn>
            </div>
            <div class="top-bar-action">
                <!-- Delete button -->
                <v-btn 
                    icon="mdi-delete" 
                    @click="handleDeleteClicked">
                </v-btn>
            </div>
        </div>
        <div class="top-bar-right">
            <div class="top-bar-action">
                <!-- Create category button -->
                <v-btn 
                    icon="mdi-plus" 
                    @click="handleCreateCategoryClicked">
                </v-btn>
            </div>
        </div>
    </div>
    <v-divider />

    <div v-if="!isReady">Loading...</div>
    <div v-else>
        <CategoriesList :categories="categories" @selectedItemChanged="handleSelectedItemChanged"/>
    </div>
</template>
