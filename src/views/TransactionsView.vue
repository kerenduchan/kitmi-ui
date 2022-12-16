<script setup>
import { ref } from 'vue'
import TopBar from '@/components/TopBar.vue'
import TransactionsList from '@/components/TransactionsList.vue'
import EditTransaction from '@/components/EditTransaction.vue'
import getTransactions from '@/composables/queries/getTransactions'
import getCategories from '@/composables/queries/getCategories'
import dialog from '@/composables/dialog'

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

// logic for selected item
const selectedItem = ref(null)

function isItemSelected() {
    return selectedItem.value !== null
}

function handleSelectedItemChanged(t) {
    selectedItem.value = t
}

// logic for the edit dialog
const {
    show: showEditDialog,
    item: itemForEditDialog,
    open: openEditDialog,
    close: closeEditDialog
} = dialog(selectedItem)

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
