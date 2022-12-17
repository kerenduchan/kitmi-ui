<script setup>
import { ref, computed, watch } from 'vue'
import CreateCategory from '@/components/CreateCategory.vue'
import CreateSubcategory from '@/components/CreateSubcategory.vue'
import DeleteCategory from '@/components/DeleteCategory.vue'
import DeleteSubcategory from '@/components/DeleteSubcategory.vue'
import ButtonWithTooltip from '@/components/ButtonWithTooltip.vue'
import CategoriesList from '@/components/CategoriesList.vue'
import Subcategory from '@/composables/model/Subcategory'
import getCategories from '@/composables/queries/getCategories'

const { categories, isReady, refetch } = getCategories()

// a selected category or subcategory
const selectedItem = ref(null)

const selectedItemTypeStr = ref('')

const isDeleteDisabled = computed(() => {
    if(!selectedItem.value) {
        // no item is selected
        return true
    }
    if(selectedItem.value instanceof Subcategory) {
        return false
    }
    
    // selected item is a category -
    // can't delete a category with subcategories
    return selectedItem.value.hasSubcategories
})

function handleSelectedItemChanged(item) {
    selectedItem.value = item ? item : null
}

watch(selectedItem, () => {
    if(!selectedItem.value) {
        selectedItemTypeStr.value =  ''
    } else {
        selectedItemTypeStr.value = 
            selectedItem.value instanceof Subcategory ? 
            'subcategory' :
            'category'
    }
})

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

const isCreateSubcategoryHidden = computed(() => {
    // can't create a subcategory for a subcategory
    return selectedItem.value && selectedItem.value instanceof Subcategory
})

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

// delete subcategory dialog
const showDeleteSubcategoryDialog = ref(false)
const subcategoryToDelete = ref(null)

function openDeleteSubcategoryDialog() {
    subcategoryToDelete.value = selectedItem.value
    showDeleteSubcategoryDialog.value = true
}

function handleSubcategoryDeleted() {
    showDeleteSubcategoryDialog.value = false
    selectedItem.value = null
    refetch()
}

function openDeleteCategoryOrDeleteSubcategoryDialog() {
    if(selectedItem.value instanceof Subcategory) {
        openDeleteSubcategoryDialog()
    } else {
        openDeleteCategoryDialog()
    }
}

</script>

<template>
    <div class="top-bar">
        <div class="top-bar-left">

            <!-- Edit button -->
            <div class="top-bar-action">
                <ButtonWithTooltip 
                    :tooltip="'Edit ' + selectedItemTypeStr" 
                    icon="mdi-pencil"
                    :disabled="!selectedItem"
                    @click="handleEditClicked"
                />
            </div>

            <!-- Create subcategory button -->
            <div v-if="!isCreateSubcategoryHidden" class="top-bar-action">
                <ButtonWithTooltip 
                    tooltip="Create subcategory" 
                    icon="mdi-plus"
                    :disabled="!selectedItem"
                    @click="showCreateSubcategoryDialog = true"
                />
            </div>

            <!-- Delete category/subcategory button -->
            <div class="top-bar-action">
                <ButtonWithTooltip 
                    :tooltip="'Delete ' + selectedItemTypeStr"
                    icon="mdi-delete"
                    :disabled="isDeleteDisabled"
                    @click="openDeleteCategoryOrDeleteSubcategoryDialog"
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

        <!-- Delete subcategory dialog -->
        <v-dialog v-model="showDeleteSubcategoryDialog">
            <DeleteSubcategory
                :item="subcategoryToDelete"
                @close="showDeleteSubcategoryDialog = false"
                @deleted="handleSubcategoryDeleted" />
        </v-dialog>

</div>
</template>
