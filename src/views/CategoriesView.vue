<script setup>
import { ref, computed } from 'vue'
import EditCategory from '@/components/EditCategory.vue'
import EditSubcategory from '@/components/EditSubcategory.vue'
import CreateCategory from '@/components/CreateCategory.vue'
import FindSubcategory from '@/components/FindSubcategory.vue'
import CreateSubcategory from '@/components/CreateSubcategory.vue'
import DeleteCategory from '@/components/DeleteCategory.vue'
import DeleteSubcategory from '@/components/DeleteSubcategory.vue'
import ButtonWithTooltip from '@/components/ButtonWithTooltip.vue'
import CategoriesList from '@/components/CategoriesList.vue'
import moveCategoryUp from '@/composables/mutations/moveCategoryUp'
import moveCategoryDown from '@/composables/mutations/moveCategoryDown'
import getStore from '@/composables/store'

const store = getStore()
const categories = store.categories

// The ID of the selected category (undefined if none is selected)
const selectedCategoryId = ref(undefined)

// The selected category (undefined if none is selected)
const selectedCategory = computed(() => {
    if(!selectedCategoryId) {
        return undefined
    }
    return categories.value.find(c => c.id === selectedCategoryId.value)
})

// The ID of the selected subcategory (undefined if none is selected)
const selectedSubcategoryId = ref(undefined)

// The selected category (undefined if none is selected)
function getSelectedSubcategory() {
    if(!selectedCategory.value || !selectedSubcategoryId.value) {
        return undefined
    }
    return selectedCategory.value.subcategories.find(s => s.id === selectedSubcategoryId.value)
}

function getCategoryIdBySubcategoryId(subcategoryId) {
    const found = categories.value.find(c => c.subcategories.find(s => s.id === subcategoryId))
    return found ? found.id : undefined
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

// create category dialog
const showCreateCategoryDialog = ref(false)

function handleCategoryCreated(category) {
    // force-select the newly created category in the list
    selectedCategoryId.value = category.id
    showCreateCategoryDialog.value = false
    store.refetchCategories()
}

// create subcategory dialog
const showCreateSubcategoryDialog = ref(false)
  
function handleSubcategoryCreated() {
    showCreateSubcategoryDialog.value = false
    store.refetchCategories()
}

const isCreateSubcategoryHidden = computed(() => {
    // can't create a subcategory for a subcategory
    return selectedSubcategoryId.value !== undefined
})

// delete category dialog
const showDeleteCategoryDialog = ref(false)

function handleCategoryDeleted() {
    selectedCategoryId.value = undefined
    showDeleteCategoryDialog.value = false
    store.refetchCategories()
}

// delete subcategory dialog
const showDeleteSubcategoryDialog = ref(false)

function handleSubcategoryDeleted() {
    selectedSubcategoryId.value = undefined
    showDeleteSubcategoryDialog.value = false
    store.refetchCategories()
}

// edit category
const showEditCategoryDialog = ref(false)

function handleCategoryEdited() {
    showEditCategoryDialog.value = false
    store.refetchCategories()
}

// edit subcategory
const showEditSubcategoryDialog = ref(false)

function handleSubcategoryEdited(subcategory) {
    // update the selectedCategoryId, 
    // in case the subcategory moved to a different category
    selectedCategoryId.value = subcategory.category.id
    showEditSubcategoryDialog.value = false
    store.refetchCategories()
}

function openDeleteCategoryOrDeleteSubcategoryDialog() {
    if(selectedSubcategoryId.value) {
        showDeleteSubcategoryDialog.value = true
    } else {
        showDeleteCategoryDialog.value = true
    }
}

function openEditCategoryOrEditSubcategoryDialog() {
    if(selectedSubcategoryId.value) {
        showEditSubcategoryDialog.value = true
    } else {
        showEditCategoryDialog.value = true
    }
}

const isMoveCategoryButtonVisible = computed(() => {
    // should be visible unless a subcategory is selected
    return !selectedSubcategoryId.value
})

const { gqlMoveCategoryDown, onDone: onMoveCategoryDownDone } = moveCategoryDown()

function doMoveCategoryDown() {
    gqlMoveCategoryDown({
        categoryId: selectedCategoryId.value
    })
}

onMoveCategoryDownDone(() => {
    store.refetchCategories()
})

const { gqlMoveCategoryUp, onDone: onMoveCategoryUpDone } = moveCategoryUp()

function doMoveCategoryUp() {
    gqlMoveCategoryUp({
        categoryId: selectedCategoryId.value
    })
}

onMoveCategoryUpDone(() => {
    store.refetchCategories()
})

function isMoveCategoryDownDisabled() {
    // Move category down is disabled if no category is selected or 
    // the selected category can't move any further down
    return !selectedCategoryId.value ||
    selectedCategoryId.value === categories.value[categories.value.length - 1].id
}

function isMoveCategoryUpDisabled() {
    // Move category up is disabled if no category is selected or 
    // the selected category can't move any further up
    return !selectedCategoryId.value ||
    selectedCategoryId.value === categories.value[0].id
}

// find subcategory
const showFindSubcategoryDialog = ref(false)

function handleFindSubcategory(subcategoryId) {
    // force-select the found subcategory
    selectedCategoryId.value = getCategoryIdBySubcategoryId(subcategoryId)
    selectedSubcategoryId.value = subcategoryId
    showFindSubcategoryDialog.value = false
}

function handleSelectCategory(categoryId) {
    selectedCategoryId.value = categoryId
    selectedSubcategoryId.value = undefined
}

function handleSelectSubcategory(subcategoryId) {
    selectedSubcategoryId.value = subcategoryId
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
            @save="handleSubcategoryCreated" />
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
