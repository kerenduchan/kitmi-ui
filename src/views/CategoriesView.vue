<script setup>
import { ref, computed } from 'vue'
import CreateCategory from '@/components/CreateCategory.vue'
import CreateSubcategory from '@/components/CreateSubcategory.vue'
import DeleteCategory from '@/components/DeleteCategory.vue'
import ButtonWithTooltip from '@/components/ButtonWithTooltip.vue'
import CategoriesList from '@/components/CategoriesList.vue'
import getCategories from '@/composables/queries/getCategories'

const { categories, isReady, refetch } = getCategories()

const selectedItem = ref(null)

const isItemSelected = computed(() => {
    return selectedItem.value !== null
})

const isDeleteDisabled = computed(() => {
    const c = selectedItem.value
    // can't delete a category with subcategories
    return !c || c.hasSubcategories
})

function handleSelectedItemChanged(item) {
    console.log("handleSelectedItemChanged " + (item ? item.name : ''))
    selectedItem.value = item ? item : null
}

function handleEditClicked() {
    console.log('handleEditClicked')
}

// create category dialog
const showCreateCategoryDialog = ref(false)

function handleCategoryCreated() {
    refetch()
    showCreateCategoryDialog.value = false
}

// create subcategory dialog
const showCreateSubcategoryDialog = ref(false)
    
function handleSubcategoryCreated() {
    showCreateSubcategoryDialog.value = false
    refetch()
}

// delete category dialog
const showDeleteCategoryDialog = ref(false)
const categoryToDelete = ref(null)

function openDeleteCategoryDialog() {
    categoryToDelete.value = selectedItem.value
    showDeleteCategoryDialog.value = true
}

function handleCategoryDeleted() {
    showDeleteCategoryDialog.value = false
    selectedItem.value = null
    refetch()
}

</script>

<template>
    <div class="top-bar">
        <div class="top-bar-left">

            <!-- Edit button -->
            <div class="top-bar-action">
                <ButtonWithTooltip 
                    tooltip="Edit category" 
                    icon="mdi-pencil"
                    :disabled="!isItemSelected"
                    @click="handleEditClicked"
                />
            </div>

            <!-- Create subcategory button -->
            <div class="top-bar-action">
                <ButtonWithTooltip 
                    tooltip="Create subcategory" 
                    icon="mdi-plus"
                    :disabled="!isItemSelected"
                    @click="showCreateSubcategoryDialog = true"
                />
            </div>

            <!-- Delete button -->
            <div class="top-bar-action">
                <ButtonWithTooltip 
                    tooltip="Delete category" 
                    icon="mdi-delete"
                    :disabled="isDeleteDisabled"
                    @click="openDeleteCategoryDialog"
                />
            </div>
        </div>


        <div class="top-bar-right">

            <!-- Create category button -->
            <div class="top-bar-action">
                <ButtonWithTooltip 
                    tooltip="Create category" 
                    icon="mdi-plus"
                    @click="showCreateCategoryDialog = true"
                />
            </div>
        </div>
    </div>
    <v-divider />

    <div v-if="!isReady">Loading...</div>
    <div v-else>
        <!-- List of categories -->
        <CategoriesList :categories="categories" @selectedItemChanged="handleSelectedItemChanged"/>

        <!-- Create category dialog -->
        <v-dialog v-model="showCreateCategoryDialog">
            <CreateCategory 
                :categories="categories"
                @close="showCreateCategoryDialog = false"
                @save="handleCategoryCreated" />
        </v-dialog>

        <!-- Create subcategory dialog -->
        <v-dialog v-model="showCreateSubcategoryDialog">
            <CreateSubcategory
                :category="selectedItem"
                @close="showCreateSubcategoryDialog = false"
                @save="handleSubcategoryCreated" />
        </v-dialog>

        <!-- Delete category dialog -->
        <v-dialog v-model="showDeleteCategoryDialog">
            <DeleteCategory
                :item="categoryToDelete"
                @close="showDeleteCategoryDialog = false"
                @deleted="handleCategoryDeleted" />
        </v-dialog>

</div>
</template>
