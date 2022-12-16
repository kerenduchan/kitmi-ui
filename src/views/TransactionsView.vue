<script setup>
import { ref } from 'vue'
import TopBar from '@/components/TopBar.vue'
import TransactionsList from '@/components/TransactionsList.vue'
import EditTransaction from '@/components/EditTransaction.vue'
import getTransactions from '@/composables/queries/getTransactions'
import getCategories from '@/composables/queries/getCategories'

const {
    transactions: items,
    isReady: isItemsReady,
    refetch: refetchItems
} = getTransactions()

const {
    categories,
    isReady: isCategoriesReady,
    refetch: refetchCategories
} = getCategories()

const showEditDialog = ref(false)
const itemForEditDialog = ref(null)
const selectedItem = ref(null)

function handleSelectedItemChanged(t) {
    selectedItem.value = t
}

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

function isItemSelected() {
    return selectedItem.value !== null
}

</script>

<template>
    <TopBar>
        <!-- Edit button -->
        <v-btn 
            icon="mdi-pencil" 
            :disabled="!isItemSelected()" @click="openEditDialog"></v-btn>
    </TopBar>

    <div v-if="!isItemsReady || !isCategoriesReady">
        Loading...
    </div>
    
    <div v-else>

        <!-- List (table) of transactions -->
        <TransactionsList 
            :transactions="items" 
            @selectedItemChanged="handleSelectedItemChanged"/>

        <!-- Edit selected transaction dialog -->
        <v-dialog v-model="showEditDialog">
            <EditTransaction 
                :item="itemForEditDialog"
                :categories="categories" 
                @close="closeEditDialog"
                @change="handleChange" 
            />
        </v-dialog>
    </div>

</template>
