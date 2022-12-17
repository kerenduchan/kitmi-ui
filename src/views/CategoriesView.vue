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
                <v-tooltip text="Edit category" location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-btn 
                            v-bind="props"
                            icon="mdi-pencil" 
                            @click="handleEditClicked">
                        </v-btn>
                    </template>
                </v-tooltip>
            </div>
            <div class="top-bar-action">
                <!-- Add subcategory button -->
                <v-tooltip text="Add subcategory" location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-btn 
                            v-bind="props"
                            icon="mdi-plus" 
                            @click="handleCreateSubcategoryClicked">
                        </v-btn>
                    </template>
                </v-tooltip>
            </div>
            <div class="top-bar-action">
                <v-tooltip text="Delete category" location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-btn 
                            v-bind="props"
                            icon="mdi-delete" 
                            @click="handleDeleteClicked">
                        </v-btn>
                    </template>
                </v-tooltip>
            </div>
        </div>
        <div class="top-bar-right">
            <div class="top-bar-action">
                <!-- Create category button -->
                <v-tooltip text="Create category" location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-btn 
                            v-bind="props"
                            icon="mdi-plus" 
                            @click="handleCreateCategoryClicked">
                        </v-btn>
                    </template>
                </v-tooltip>
            </div>
        </div>
    </div>
    <v-divider />

    <div v-if="!isReady">Loading...</div>
    <div v-else>
        <CategoriesList :categories="categories" @selectedItemChanged="handleSelectedItemChanged"/>
    </div>
</template>
