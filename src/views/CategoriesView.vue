<script setup>
import { ref, computed } from 'vue'
import CreateCategory from '@/components/CreateCategory.vue'
import ButtonWithTooltip from '@/components/ButtonWithTooltip.vue'
import CategoriesList from '@/components/CategoriesList.vue'
import getCategories from '@/composables/queries/getCategories'
import dialog from '@/composables/dialog'

const { categories, isReady, refetch } = getCategories()

const selectedItem = ref(null)

const isItemSelected = computed(() => {
    return selectedItem.value !== null
})

const isDeleteDisabled = computed(() => {
    const c = selectedItem.value
    // can't delete a category with subcategories
    return c === null || c.hasSubcategories
})

function handleSelectedItemChanged(item) {
    console.log('selected item changed ' + item.name)
    selectedItem.value = item
}

function handleEditClicked() {
    console.log('handleEditClicked')
}

function handleDeleteClicked() {
    console.log('handleDeleteClicked')
}

function handleCreateSubcategoryClicked() {
    console.log('handleCreateSubcategoryClicked')
}

// create category dialog
const {
    show: showCreateCategoryDialog,
    open: openCreateCategoryDialog,
    close: closeCreateCategoryDialog
} = dialog()

function handleCategoryCreated() {
    refetch()
    closeCreateCategoryDialog()
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
                    @click="handleCreateSubcategoryClicked"
                />
            </div>

            <!-- Delete button -->
            <div class="top-bar-action">
                <ButtonWithTooltip 
                    tooltip="Delete category" 
                    icon="mdi-delete"
                    :disabled="isDeleteDisabled"
                    @click="handleDeleteClicked"
                />
            </div>
        </div>


        <div class="top-bar-right">

            <!-- Create category button -->
            <div class="top-bar-action">
                <ButtonWithTooltip 
                    tooltip="Create category" 
                    icon="mdi-plus"
                    @click="openCreateCategoryDialog"
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
                @close="closeCreateCategoryDialog"
                @save="handleCategoryCreated" />
        </v-dialog>

    </div>
</template>
