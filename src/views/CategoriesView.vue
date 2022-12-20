<script setup>
import { ref, computed, watch } from 'vue'
import EditCategory from '@/components/EditCategory.vue'
import EditSubcategory from '@/components/EditSubcategory.vue'
import CreateCategory from '@/components/CreateCategory.vue'
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

// a selected category or subcategory
const selectedItem = ref(null)

const selectedItemTypeStr = ref('')

const isDeleteDisabled = computed(() => {
    if(!selectedItem.value) {
        // no item is selected
        return true
    }
    if(selectedItem.value.objClass == 'Subcategory') {
        return false
    }
    
    // selected item is a category -
    // can't delete a category with subcategories
    return selectedItem.value.hasSubcategories
})

function handleSelectedItemChanged(item) {
    selectedItem.value = item ? item : null
    forceSelectedItemKey.value = null
}

watch(selectedItem, () => {
    if(!selectedItem.value) {
        selectedItemTypeStr.value =  ''
    } else {
        selectedItemTypeStr.value = 
            selectedItem.value.objClass == 'Subcategory' ? 
            'subcategory' :
            'category'
    }
})

function handleChange() {
    // close any and all dialogs
    showCreateCategoryDialog.value = false
    showCreateSubcategoryDialog.value = false
    showDeleteCategoryDialog.value = false
    showDeleteSubcategoryDialog.value = false
    showEditCategoryDialog.value = false
    showEditSubcategoryDialog.value = false

    // refetch categories from server
    store.refetchCategories()
}

// create category dialog
const showCreateCategoryDialog = ref(false)

// create subcategory dialog
const showCreateSubcategoryDialog = ref(false)
    
const isCreateSubcategoryHidden = computed(() => {
    // can't create a subcategory for a subcategory
    return selectedItem.value && selectedItem.value.objClass == 'Subcategory'
})

// delete category dialog
const showDeleteCategoryDialog = ref(false)
const categoryToDelete = ref(null)

function openDeleteCategoryDialog() {
    categoryToDelete.value = selectedItem.value
    showDeleteCategoryDialog.value = true
}

// delete subcategory dialog
const showDeleteSubcategoryDialog = ref(false)
const subcategoryToDelete = ref(null)

function openDeleteSubcategoryDialog() {
    subcategoryToDelete.value = selectedItem.value
    showDeleteSubcategoryDialog.value = true
}

// edit category
const showEditCategoryDialog = ref(false)

// edit subcategory
const showEditSubcategoryDialog = ref(false)

function openDeleteCategoryOrDeleteSubcategoryDialog() {
    if(selectedItem.value.objClass == 'Subcategory') {
        openDeleteSubcategoryDialog()
    } else {
        openDeleteCategoryDialog()
    }
}

function openEditCategoryOrEditSubcategoryDialog() {
    if(selectedItem.value.objClass == 'Subcategory') {
        showEditSubcategoryDialog.value = true
    } else {
        showEditCategoryDialog.value = true
    }
}

const forceSelectedItemKey = ref(null)

function handleCategoryCreated(c) {
    forceSelectedItemKey.value = c.key
    handleChange()
}

function handleSubcategoryDeleted(s) {
    // select the deleted subcategory's category
    forceSelectedItemKey.value = 'c' + s.categoryId

    handleChange()
}

const isMoveCategoryButtonVisible = computed(() => {
    return selectedItem.value === null || 
        (selectedItem.value.objClass == 'Category')
})

const { gqlMoveCategoryDown, onDone: onMoveCategoryDownDone } = moveCategoryDown()

function doMoveCategoryDown() {
    gqlMoveCategoryDown({
        categoryId: selectedItem.value.id
    })
}

onMoveCategoryDownDone(() => {
    store.refetchCategories()
})

const { gqlMoveCategoryUp, onDone: onMoveCategoryUpDone } = moveCategoryUp()

function doMoveCategoryUp() {
    gqlMoveCategoryUp({
        categoryId: selectedItem.value.id
    })
}

onMoveCategoryUpDone(() => {
    store.refetchCategories()
})

function isMoveCategoryDownDisabled() {
    if(!selectedItem.value || categories.value.length === 0) {
        return true
    }
    if(selectedItem.value.id === categories.value[categories.value.length - 1].id) {
        // can't move the category any further down
        return true
    }
    return false
}

function isMoveCategoryUpDisabled() {
    if(!selectedItem.value || categories.value.length === 0) {
        return true
    }
    if(selectedItem.value.id === categories.value[0].id) {
        // can't move the category any further up
        return true
    }
    return false
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
                    :disabled="!selectedItem"
                    @click="openEditCategoryOrEditSubcategoryDialog"
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
        :categories="categories"
        :forceSelectedItemKey="forceSelectedItemKey"
        @selectedItemChanged="handleSelectedItemChanged"/>

    <!-- Edit category dialog -->
    <v-dialog v-model="showEditCategoryDialog">
        <EditCategory
            :item="selectedItem"
            :categories="categories"
            @close="showEditCategoryDialog = false"
            @save="handleChange" />
    </v-dialog>

    <!-- Edit subcategory dialog -->
    <v-dialog v-model="showEditSubcategoryDialog">
        <EditSubcategory
            :item="selectedItem"
            :categories="categories"
            @close="showEditSubcategoryDialog = false"
            @save="handleChange" />
    </v-dialog>

    <!-- Create category dialog -->
    <v-dialog v-model="showCreateCategoryDialog">
        <CreateCategory 
            :categories="categories"
            @close="showCreateCategoryDialog = false"
            @created="handleCategoryCreated" />
    </v-dialog>

    <!-- Create subcategory dialog -->
    <v-dialog v-model="showCreateSubcategoryDialog">
        <CreateSubcategory
            :category="selectedItem"
            @close="showCreateSubcategoryDialog = false"
            @save="handleChange" />
    </v-dialog>

    <!-- Delete category dialog -->
    <v-dialog v-model="showDeleteCategoryDialog">
        <DeleteCategory
            :item="categoryToDelete"
            @close="showDeleteCategoryDialog = false"
            @deleted="handleChange" />
    </v-dialog>

    <!-- Delete subcategory dialog -->
    <v-dialog v-model="showDeleteSubcategoryDialog">
        <DeleteSubcategory
            :item="subcategoryToDelete"
            @close="showDeleteSubcategoryDialog = false"
            @deleted="handleSubcategoryDeleted" />
    </v-dialog>

</template>
