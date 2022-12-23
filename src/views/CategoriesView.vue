<script setup>
import { ref, computed } from 'vue'

// components
import ButtonWithTooltip from '@/components/ButtonWithTooltip.vue'
import Snackbar from '@/components/Snackbar.vue'
import EditCategory from '@/components/EditCategory.vue'
import EditSubcategory from '@/components/EditSubcategory.vue'
import CreateCategory from '@/components/CreateCategory.vue'
import FindSubcategory from '@/components/FindSubcategory.vue'
import CreateSubcategory from '@/components/CreateSubcategory.vue'
import DeleteCategory from '@/components/DeleteCategory.vue'
import DeleteSubcategory from '@/components/DeleteSubcategory.vue'
import CategoriesList from '@/components/CategoriesList.vue'

// composables
import getStore from '@/composables/store'
import snackbar from '@/composables/snackbar'
import moveCategoryUp from '@/composables/mutations/moveCategoryUp'
import moveCategoryDown from '@/composables/mutations/moveCategoryDown'

// ----------------------------------------------------------------------------
// store
const store = getStore()
const categories = store.categories

// ----------------------------------------------------------------------------
// snackbar
const { showSnackbar, snackbarText, displaySnackbar } = snackbar()

// ----------------------------------------------------------------------------
// selected category and subcategory

// The ID of the selected category (null if none is selected)
const selectedCategoryId = ref(null)

// The selected category (null if none is selected)
const selectedCategory = computed(() => {
    if(!selectedCategoryId) {
        return null
    }
    const found = categories.value.find(c => c.id === selectedCategoryId.value)
    return found ? found : null
})

// The ID of the selected subcategory (null if none is selected)
const selectedSubcategoryId = ref(null)

// The selected subcategory (null if none is selected)
function getSelectedSubcategory() {
    if(!selectedCategory.value || !selectedSubcategoryId.value) {
        return null
    }
    const found = selectedCategory.value.subcategories.find(s => s.id === selectedSubcategoryId.value)
    return found ? found : null
}

function getCategoryIdBySubcategoryId(subcategoryId) {
    const found = categories.value.find(c => c.subcategories.find(s => s.id === subcategoryId))
    return found ? found.id : null
}
// for the action buttons' tooltips
const selectedItemTypeStr = computed(() => {
    if(selectedSubcategoryId.value) {
        return 'subcategory'
    } 
    if(selectedCategoryId.value) {
        return 'category'
    }
    return ''
})

function handleSelectCategory(categoryId) {
    selectedCategoryId.value = categoryId
    selectedSubcategoryId.value = null
}

function handleSelectSubcategory(subcategoryId) {
    selectedSubcategoryId.value = subcategoryId
}

// ----------------------------------------------------------------------------
// delete category / subcategory

function openDeleteCategoryOrDeleteSubcategoryDialog() {
    if(selectedSubcategoryId.value) {
        showDeleteSubcategoryDialog.value = true
    } else {
        showDeleteCategoryDialog.value = true
    }
}

const isDeleteDisabled = computed(() => {
    if(selectedSubcategoryId.value) {
        // The selected item is a subcategory.
        // Subcategories can always be deleted.
        return false
    }
    if(selectedCategoryId.value) {
        // The selected item is a category.
        // Can't delete a category with subcategories.
        return selectedCategory.value.hasSubcategories
    }
    
    // No item is selected. Delete should be disabled.
    return true

})

// ----------------------------------------------------------------------------
// delete category

const showDeleteCategoryDialog = ref(false)

function handleCategoryDeleted() {
    selectedCategoryId.value = null
    showDeleteCategoryDialog.value = false
    store.refetchCategories()
}

// ----------------------------------------------------------------------------
// delete subcategory

const showDeleteSubcategoryDialog = ref(false)

function handleSubcategoryDeleted() {
    selectedSubcategoryId.value = null
    showDeleteSubcategoryDialog.value = false
    store.refetchCategories()
}

// ----------------------------------------------------------------------------
// create category

const showCreateCategoryDialog = ref(false)

function handleCategoryCreated(category) {
    // force-select the newly created category in the list
    selectedCategoryId.value = category.id
    showCreateCategoryDialog.value = false
    store.refetchCategories()
}

// ----------------------------------------------------------------------------
// create subcategory

const showCreateSubcategoryDialog = ref(false)
  
const isCreateSubcategoryHidden = computed(() => {
    // can't create a subcategory for a subcategory
    return selectedSubcategoryId.value !== null
})

function handleSubcategoryCreated(subcategory) {
    // force-select the newly created subcategory in the list
    selectedSubcategoryId.value = subcategory.id

    showCreateSubcategoryDialog.value = false
    store.refetchCategories()
}

// ----------------------------------------------------------------------------
// edit category / subcategory

function openEditCategoryOrEditSubcategoryDialog() {
    if(selectedSubcategoryId.value) {
        showEditSubcategoryDialog.value = true
    } else {
        showEditCategoryDialog.value = true
    }
}

// ----------------------------------------------------------------------------
// edit category

const showEditCategoryDialog = ref(false)

function handleCategoryEdited() {
    showEditCategoryDialog.value = false
    store.refetchCategories()
}

// ----------------------------------------------------------------------------
// edit subcategory

const showEditSubcategoryDialog = ref(false)

function handleSubcategoryEdited(subcategory) {
    // update the selectedCategoryId, 
    // in case the subcategory moved to a different category
    selectedCategoryId.value = subcategory.category.id
    showEditSubcategoryDialog.value = false
    store.refetchCategories()
}

// ----------------------------------------------------------------------------
// move category

const isMoveCategoryButtonVisible = computed(() => {
    // should be visible unless a subcategory is selected
    return !selectedSubcategoryId.value
})

// ----------------------------------------------------------------------------
// move category down

function isMoveCategoryDownDisabled() {
    // Move category down is disabled if no category is selected or 
    // the selected category can't move any further down
    return !selectedCategoryId.value ||
    selectedCategoryId.value === categories.value[categories.value.length - 1].id
}

const { 
    gqlMoveCategoryDown, 
    onDone: onMoveCategoryDownDone 
} = moveCategoryDown()

function doMoveCategoryDown() {
    gqlMoveCategoryDown({
        categoryId: selectedCategoryId.value
    })
}

onMoveCategoryDownDone(() => {
    store.refetchCategories()
})

// ----------------------------------------------------------------------------
// move category up

function isMoveCategoryUpDisabled() {
    // Move category up is disabled if no category is selected or 
    // the selected category can't move any further up
    return !selectedCategoryId.value ||
    selectedCategoryId.value === categories.value[0].id
}

const { 
    gqlMoveCategoryUp, 
    onDone: onMoveCategoryUpDone 
} = moveCategoryUp()

function doMoveCategoryUp() {
    gqlMoveCategoryUp({
        categoryId: selectedCategoryId.value
    })
}

onMoveCategoryUpDone(() => {
    store.refetchCategories()
})

// ----------------------------------------------------------------------------
// find subcategory

const showFindSubcategoryDialog = ref(false)

function handleFindSubcategory(subcategoryId) {
    // force-select the found subcategory
    selectedCategoryId.value = getCategoryIdBySubcategoryId(subcategoryId)
    selectedSubcategoryId.value = subcategoryId
    showFindSubcategoryDialog.value = false
}

</script>

<template>
    <div class="top-bar">
        <div class="top-bar-left">

            <!-- Edit category/subcategory button -->
            <div class="top-bar-action">
                <ButtonWithTooltip 
                    :tooltip="'Edit ' + selectedItemTypeStr" 
                    icon="mdi-pencil"
                    :disabled="!selectedCategoryId && !selectedSubcategoryId"
                    @click="openEditCategoryOrEditSubcategoryDialog"
                />
            </div>

            <!-- Create subcategory button -->
            <div v-if="!isCreateSubcategoryHidden" class="top-bar-action">
                <ButtonWithTooltip 
                    tooltip="Create subcategory" 
                    icon="mdi-plus"
                    :disabled="!selectedCategoryId && !selectedSubcategoryId"
                    @click="showCreateSubcategoryDialog = true"
                />
            </div>

            <!-- Move category down button -->
            <div v-if="isMoveCategoryButtonVisible" class="top-bar-action">
                <ButtonWithTooltip 
                    tooltip="Move Category Down" 
                    icon="mdi-arrow-down"
                    :disabled="isMoveCategoryDownDisabled()"
                    @click="doMoveCategoryDown"
                />
            </div>

            <!-- Move category up button -->
            <div v-if="isMoveCategoryButtonVisible" class="top-bar-action">
                <ButtonWithTooltip 
                    tooltip="Move Category Up" 
                    icon="mdi-arrow-up"
                    :disabled="isMoveCategoryUpDisabled()"
                    @click="doMoveCategoryUp"
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

            <!-- Find subcategory button -->
            <div class="top-bar-action">
                <ButtonWithTooltip 
                    tooltip="Find subcategory" 
                    icon="mdi-folder-search"
                    @click="showFindSubcategoryDialog = true"
                />
            </div>

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

    <!-- List of categories -->
    <CategoriesList 
        :selectedCategoryId="selectedCategoryId"
        :selectedSubcategoryId="selectedSubcategoryId"
        :categories="categories"
        @selectCategory="handleSelectCategory"
        @selectSubcategory="handleSelectSubcategory"
    />

    <!-- snackbar -->
    <Snackbar 
        :show="showSnackbar" 
        :text="snackbarText"
        @close="showSnackbar = false"
    />

    <!-- Edit category dialog -->
    <v-dialog v-model="showEditCategoryDialog">
        <EditCategory
            :category="selectedCategory"
            :categories="categories"
            @close="showEditCategoryDialog = false"
            @save="handleCategoryEdited" />
    </v-dialog>

    <!-- Edit subcategory dialog -->
    <v-dialog v-model="showEditSubcategoryDialog">
        <EditSubcategory
            :subcategory="getSelectedSubcategory()"
            :categories="categories"
            @close="showEditSubcategoryDialog = false"
            @save="handleSubcategoryEdited" />
    </v-dialog>

    <!-- Create category dialog -->
    <v-dialog v-model="showCreateCategoryDialog">
        <CreateCategory 
            :categories="categories"
            @close="showCreateCategoryDialog = false"
            @created="handleCategoryCreated" />
    </v-dialog>

    <!-- Search for subcategory dialog -->
    <v-dialog v-model="showFindSubcategoryDialog">
        <FindSubcategory
            :categories="categories"
            @close="showFindSubcategoryDialog = false"
            @find="handleFindSubcategory" />
    </v-dialog>

    <!-- Create subcategory dialog -->
    <v-dialog v-model="showCreateSubcategoryDialog">
        <CreateSubcategory
            :category="selectedCategory"
            @close="showCreateSubcategoryDialog = false"
            @created="handleSubcategoryCreated" />
    </v-dialog>

    <!-- Delete category dialog -->
    <v-dialog v-model="showDeleteCategoryDialog">
        <DeleteCategory
            :category="selectedCategory"
            @close="showDeleteCategoryDialog = false"
            @deleted="handleCategoryDeleted" />
    </v-dialog>

    <!-- Delete subcategory dialog -->
    <v-dialog v-model="showDeleteSubcategoryDialog">
        <DeleteSubcategory
            :subcategory="getSelectedSubcategory()"
            @close="showDeleteSubcategoryDialog = false"
            @deleted="handleSubcategoryDeleted" />
    </v-dialog>

</template>
