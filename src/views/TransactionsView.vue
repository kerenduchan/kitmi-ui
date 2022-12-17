<script setup>
import { ref, computed } from 'vue'
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

// Show only uncategorized filter (v-model for checkbox)
const uncategorized = ref(false)

// The items, after applying the filter
const filteredItems = computed(() => {
    if(uncategorized.value === true) {
        return items.value.filter(item => !item.isCategorized)
    }
    return items.value
})

// The selected item
const selectedItem = ref(null)

// update the selected item
function handleSelectedItemChanged(item) {
    selectedItem.value = item
}

// The selected item if it's not filtered out, null otherwise
const filteredSelectedItem = computed(() => {
    if (selectedItem.value === null) {
        return null
    }
    const found = filteredItems.value.find(item => item.id === selectedItem.value.id)
    return found ? selectedItem.value : null
})

// Return whether or not any item is selected
function isItemSelected() {
    return filteredSelectedItem.value !== null
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
        <v-container>
            <v-row>
                <v-col cols="3">
                    <!-- Edit button -->
                    <v-btn 
                        icon="mdi-pencil" 
                        :disabled="!isItemSelected()" @click="openEditDialog">
                    </v-btn>
                </v-col>
                <v-col cols="6">
                    <!-- Uncategorized checkbox -->
                    <v-checkbox label="Uncategorized" v-model="uncategorized"></v-checkbox>
                </v-col>
            </v-row>
        </v-container>
    <v-divider></v-divider>

    <div v-if="!isItemsReady || !isCategoriesReady">
        Loading...
    </div>
    
    <div v-else>

        <!-- List (table) of transactions -->
        <TransactionsList 
            :items="filteredItems" 
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
