<script setup>
import { ref, computed } from 'vue'
import ButtonWithTooltip from '@/components/ButtonWithTooltip.vue';
import PayeesList from '@/components/PayeesList.vue'
import EditPayee from '@/components/EditPayee.vue'
import getStore from '@/composables/store'
import dialog from '@/composables/dialog'

const store = getStore()
const categories = store.categories
const items = store.payees

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
    store.refetchPayees()
}

</script>

<template>
    <div class="top-bar">
        <div class="top-bar-left">

            <!-- Edit button -->
            <div class="top-bar-action">
                <ButtonWithTooltip 
                    tooltip="Edit payee" 
                    icon="mdi-pencil"
                    :disabled="!isItemSelected()"
                    @click="openEditDialog"
                />
            </div>

            <v-divider vertical />


            <!-- Uncategorized checkbox -->
            <div class="top-bar-action">
                <v-tooltip text="Toggle show only uncategorized" location="bottom">
                    <template v-slot:activator="{ props }">
                        <v-checkbox-btn 
                            v-bind="props"
                            label="Uncategorized" 
                            v-model="uncategorized">
                        </v-checkbox-btn>
                    </template>
                </v-tooltip>
            </div>
        </div>
    </div>
    <v-divider />

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
</template>