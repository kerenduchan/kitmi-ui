<script setup>
import { ref, computed } from 'vue'

// components
import ButtonWithTooltip from '@/components/ButtonWithTooltip.vue'
import Snackbar from '@/components/Snackbar.vue'
import CreateOrEditCategory from '@/components/CreateOrEditCategory.vue'
import CreateOrEditSubcategory from '@/components/CreateOrEditSubcategory.vue'
import FindSubcategory from '@/components/FindSubcategory.vue'
import AreYouSure from '@/components/AreYouSure.vue'
import CategoriesList from '@/components/CategoriesList.vue'

// composables
import snackbar from '@/composables/snackbar'
import getCreateCategory from '@/composables/mutations/createCategory'
import getUpdateCategory from '@/composables/mutations/updateCategory'
import getCreateSubcategory from '@/composables/mutations/createSubcategory'
import getUpdateSubcategory from '@/composables/mutations/updateSubcategory'
import deleteCategory from '@/composables/mutations/deleteCategory'
import deleteSubcategory from '@/composables/mutations/deleteSubcategory'
import moveCategoryUp from '@/composables/mutations/moveCategoryUp'
import moveCategoryDown from '@/composables/mutations/moveCategoryDown'
import getCategories from '@/composables/queries/getCategories'
import Category from '@/composables/model/Category'

// ----------------------------------------------------------------------------
// categories (from the server)
const categories = ref(null)

const { onResult, refetch } = getCategories()

onResult(res => {
    categories.value = res.data.categories.map((p) => new Category(p))
})

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
// create / edit category

const showCreateOrEditCategoryDialog = ref(false)

// null for create, the selected category for edit
const categoryForCreateOrEditCategoryDialog = ref(null)

function openCreateOrEditCategoryDialog(isCreate) {
    categoryForCreateOrEditCategoryDialog.value = isCreate ? null : selectedCategory.value
    showCreateOrEditCategoryDialog.value = true
}

function handleSaveOnCreateOrEditCategory(category) {
    if(categoryForCreateOrEditCategoryDialog.value) {
        updateCategory(category)
    } else {
        createCategory(category)
    }
}

// handle click on the edit button (edit the selected category/subcategory)
function handleEditClicked() {
    if(selectedSubcategoryId.value) {
        openCreateOrEditSubcategoryDialog(false)
    } else {
        openCreateOrEditCategoryDialog(false)
    }
}

// ----------------------------------------------------------------------------
// create category

const { 
    createCategory,
    onDone: onCreateCategoryDone,
    onError: onCreateCategoryError
} = getCreateCategory()

onCreateCategoryDone((res) => {
    const category = res.data.createCategory
    // force-select the newly created category in the list
    selectedCategoryId.value = category.id
    showCreateOrEditCategoryDialog.value = false
    refetch()
    displaySnackbar("Category '" + category.name + "' created.")

})

onCreateCategoryError((e) => {
    displaySnackbar("Failed to create category.")
    console.error(e)
})

// ----------------------------------------------------------------------------
// edit category

const { 
    updateCategory, 
    onDone: onUpdateCategoryDone, 
    onError: onUpdateCategoryError
} = getUpdateCategory()

onUpdateCategoryDone((res) => {
    const category = res.data.updateCategory
    showCreateOrEditCategoryDialog.value = false
    refetch()
    displaySnackbar("Category '" + category.name + "' updated.")
})

onUpdateCategoryError((e) => {
    displaySnackbar("Failed to update category.")
    console.error(e)
})

// ----------------------------------------------------------------------------
// create / edit subcategory

const showCreateOrEditSubcategoryDialog = ref(false)

// null for create, the selected subcategory for edit
const subcategoryForCreateOrEditCategoryDialog = ref(null)

function openCreateOrEditSubcategoryDialog(isCreate) {
    subcategoryForCreateOrEditCategoryDialog.value = isCreate ? null : getSelectedSubcategory()
    showCreateOrEditSubcategoryDialog.value = true
}

function handleSaveOnCreateOrEditSubcategory(subcategory) {
    if(subcategoryForCreateOrEditCategoryDialog.value) {
        updateSubcategory(subcategory)
    } else {
        createSubcategory(subcategory)
    }
}

// ----------------------------------------------------------------------------
// create subcategory

const isCreateSubcategoryHidden = computed(() => {
    // can't create a subcategory for a subcategory
    return selectedSubcategoryId.value !== null
})

const { 
    createSubcategory,
    onDone: onCreateSubcategoryDone,
    onError: onCreateSubcategoryError
} = getCreateSubcategory()

onCreateSubcategoryDone((res) => {
    const subcategory = res.data.createSubcategory

    // force-select the category of the newly created subcategory in the list 
    // (note that it could have been created under a different category than 
    // the selected one)
    selectedCategoryId.value = subcategory.categoryId

    showCreateOrEditSubcategoryDialog.value = false
    refetch()
    displaySnackbar("Subcategory '" + subcategory.name + "' created.")

})

onCreateSubcategoryError((e) => {
    displaySnackbar("Failed to create subcategory.")
    console.error(e)
})

// ----------------------------------------------------------------------------
// edit subcategory

const { 
    updateSubcategory, 
    onDone: onUpdateSubcategoryDone, 
    onError: onUpdateSubcategoryError
} = getUpdateSubcategory()

onUpdateSubcategoryDone((res) => {
    const subcategory = res.data.updateSubcategory

    // update the selectedCategoryId, 
    // in case the subcategory moved to a different category
    selectedCategoryId.value = subcategory.categoryId

    showCreateOrEditSubcategoryDialog.value = false
    refetch()
    displaySnackbar("Subcategory '" + subcategory.name + "' updated.")
})

onUpdateSubcategoryError((e) => {
    displaySnackbar("Failed to update subcategory.")
    console.error(e)
})

// ----------------------------------------------------------------------------
// delete category / subcategory

const showDeleteDialog = ref(false)

const isDeleteDisabled = computed(() => {
    if(selectedSubcategoryId.value) {
        // The selected item is a subcategory.
        // Subcategories can always be deleted.
        return false
    }
    if(selectedCategory.value) {
        // The selected item is a category.
        // Can't delete a category with subcategories.
        return selectedCategory.value.hasSubcategories
    }
    
    // No item is selected. Delete should be disabled.
    return true

})

function getDeleteDialogTitle() {
    if(selectedSubcategoryId.value) {
        return "Delete subcategory '" + getSelectedSubcategory().name + "'"
    }
    if(selectedCategory.value) {
        return "Delete category '" + selectedCategory.value.name + "'"
    }
    return ''
}

const { 
    gqlDeleteCategory, 
    onDone: onDeleteCategoryDone, 
    onError: onDeleteCategoryError 
} = deleteCategory()

const { 
    gqlDeleteSubcategory, 
    onDone: onDeleteSubcategoryDone, 
    onError: onDeleteSubcategoryError 
} = deleteSubcategory()

function handleDelete() {
    if(selectedSubcategoryId.value) {
        gqlDeleteSubcategory({
            subcategoryId: selectedSubcategoryId.value
        })
    } else {
        gqlDeleteCategory({
            categoryId: selectedCategoryId.value
        })
    }
}

// ----------------------------------------------------------------------------
// delete category

onDeleteCategoryDone(() => {
    const name = selectedCategory.value.name
    selectedCategoryId.value = null
    showDeleteDialog.value = false
    refetch()
    displaySnackbar("Category '" + name + "' deleted.")
})

onDeleteCategoryError((e) => {
    displaySnackbar("Failed to delete category.")
    console.error(e)
})

// ----------------------------------------------------------------------------
// delete subcategory

onDeleteSubcategoryDone(() => {
    const name = getSelectedSubcategory().name
    selectedSubcategoryId.value = null
    showDeleteDialog.value = false
    refetch()
    displaySnackbar("Subcategory '" + name + "' deleted.")
})

onDeleteSubcategoryError((e) => {
    displaySnackbar("Failed to delete subcategory.")
    console.error(e)
})

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
    if(categories.value.length === 0) {
        return true
    }
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
    refetch()
})

// ----------------------------------------------------------------------------
// move category up

function isMoveCategoryUpDisabled() {
    // Move category up is disabled if no category is selected or 
    // the selected category can't move any further up
    if(categories.value.length === 0) {
        return true
    }
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
    refetch()
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
        <div class="top-bar-left" v-if="categories">

            <!-- Edit category/subcategory button -->
            <div class="top-bar-action">
                <ButtonWithTooltip 
                    :tooltip="'Edit ' + selectedItemTypeStr" 
                    icon="mdi-pencil"
                    :disabled="!selectedCategoryId && !selectedSubcategoryId"
                    @click="handleEditClicked"
                />
            </div>

            <!-- Create subcategory button -->
            <div v-if="!isCreateSubcategoryHidden" class="top-bar-action">
                <ButtonWithTooltip 
                    tooltip="Create subcategory" 
                    icon="mdi-plus"
                    :disabled="!selectedCategoryId && !selectedSubcategoryId"
                    @click="openCreateOrEditSubcategoryDialog(true)"
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
                    @click="showDeleteDialog = true"
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
                    @click="openCreateOrEditCategoryDialog(true)"
                />
            </div>

        </div>
    </div>
    <v-divider />

    <v-container fluid>
        <v-row dense>
            <v-col>
                <v-card title="Categories">
                    <v-card-text>
                        <!-- List of categories -->
                        <CategoriesList 
                            :selectedCategoryId="selectedCategoryId"
                            :selectedSubcategoryId="selectedSubcategoryId"
                            :categories="categories"
                            @selectCategory="handleSelectCategory"
                            @selectSubcategory="handleSelectSubcategory"
                        />
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>

    <!-- snackbar -->
    <Snackbar 
        :show="showSnackbar" 
        :text="snackbarText"
        @close="showSnackbar = false"
    />

    <!-- Create / edit category dialog -->
    <v-dialog v-model="showCreateOrEditCategoryDialog">
        <CreateOrEditCategory
            :category="categoryForCreateOrEditCategoryDialog"
            :categories="categories"
            @close="showCreateOrEditCategoryDialog = false"
            @save="handleSaveOnCreateOrEditCategory" />
    </v-dialog>

    <!-- Create / edit subcategory dialog -->
    <v-dialog v-model="showCreateOrEditSubcategoryDialog">
        <CreateOrEditSubcategory
            :categoryId="selectedCategoryId"
            :subcategory="subcategoryForCreateOrEditCategoryDialog"
            :categories="categories"
            @close="showCreateOrEditSubcategoryDialog = false"
            @save="handleSaveOnCreateOrEditSubcategory" />
    </v-dialog>

    <!-- Search for subcategory dialog -->
    <v-dialog v-model="showFindSubcategoryDialog">
        <FindSubcategory
            :categories="categories"
            @close="showFindSubcategoryDialog = false"
            @find="handleFindSubcategory" />
    </v-dialog>

    <!-- Delete category / subcategory dialog -->
    <v-dialog v-model="showDeleteDialog">
        <AreYouSure 
            :title="getDeleteDialogTitle()"
            @cancel="showDeleteDialog = false"
            @yes="handleDelete" 
        />
    </v-dialog>

</template>
