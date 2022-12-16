<script setup>
import { ref } from 'vue'
import TopBar from '@/components/TopBar.vue'
import PayeesList from '@/components/PayeesList.vue'
import EditPayee from '@/components/EditPayee.vue'
import getPayees from '@/composables/queries/getPayees'
import getCategories from '@/composables/queries/getCategories'

const {
    payees: items,
    isReady: isItemsReady,
    refetch: refetchItems
} = getPayees()

const {
    categories,
    isReady: isCategoriesReady
} = getCategories()

function isReady() {
    return isItemsReady && isCategoriesReady
}

// SELECTED ITEM LOGIC

const selectedItem = ref(null)

function isItemSelected() {
    return selectedItem.value !== null
}

function handleSelectedItemChanged(t) {
    selectedItem.value = t
}

// EDIT DIALOG LOGIC

const showEditDialog = ref(false)
const itemForEditDialog = ref(null)

function openEditDialog() {
    // "freeze" the item for the dialog so it doesn't get filtered out
    // in case the item went from being uncategorized to categorized
    // and "Show Only Uncategorized" is checked
    itemForEditDialog.value = selectedItem.value
    showEditDialog.value = true
}

function closeEditDialog() {
    showEditDialog.value = false
}

function handleChange() {
    closeEditDialog()
    refetchItems()
}

</script>

<template>
    <TopBar>
        <!-- Edit button -->
        <v-btn 
            icon="mdi-pencil" 
            :disabled="!isItemSelected()" 
            @click="openEditDialog"></v-btn>
    </TopBar>

    <div v-if="!isReady">
        Loading...
    </div>

    <div v-else>
        <!-- List (table) of items -->
        <PayeesList 
            :items="items" 
            @selectedItemChanged="handleSelectedItemChanged" />

        <!-- Edit selected item dialog -->
        <v-dialog v-model="showEditDialog">
            <EditPayee 
                :item="itemForEditDialog"
                :categories="categories"
                @close="closeEditDialog"
                @change="handleChange" />
        </v-dialog>
    </div>
</template>