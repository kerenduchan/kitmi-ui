<script setup>
import { ref, computed } from 'vue'
import PayeesList from '@/components/PayeesList.vue'
import EditPayee from '@/components/EditPayee.vue'
import getPayees from '@/composables/queries/getPayees'
import getCategories from '@/composables/queries/getCategories'
import dialog from '@/composables/dialog'

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
    <div class="top-bar">
        <div class="top-bar-left">
            <div class="top-bar-action">
                <!-- Edit button -->
                <v-btn 
                    icon="mdi-pencil" 
                    :disabled="!isItemSelected()" @click="openEditDialog">
                </v-btn>
            </div>
            <v-divider vertical />
            <div class="top-bar-action">
                <!-- Uncategorized checkbox -->
                <v-checkbox-btn label="Uncategorized" v-model="uncategorized"></v-checkbox-btn>
            </div>
        </div>
    </div>
    <v-divider />

    <div v-if="!isReady">
        Loading...
    </div>

    <div v-else>
        <!-- List (table) of items -->
        <PayeesList 
            :items="filteredItems" 
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