<script setup>
import { ref, computed } from 'vue'
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
    return c === null || c.hasSubcategories
})

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
                    @click="handleCreateCategoryClicked"
                />
            </div>
        </div>
    </div>
    <v-divider />

    <div v-if="!isReady">Loading...</div>
    <div v-else>
        <CategoriesList :categories="categories" @selectedItemChanged="handleSelectedItemChanged"/>
    </div>
</template>
