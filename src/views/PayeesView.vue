<script setup>
import { ref, computed } from 'vue'
import ButtonWithTooltip from '@/components/ButtonWithTooltip.vue';
import PayeesList from '@/components/PayeesList.vue'
import EditPayee from '@/components/EditPayee.vue'
import getStore from '@/composables/store'

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

// the ID of the selected item
const selectedItemId = ref(null)

// The selected item
const selectedItem = computed(() => {
    if(selectedItemId.value === null) {
        return null
    }
    const found = filteredItems.value.find(item => item.id === selectedItemId.value)
    return found ? found : null
})

// update the selected item
function handleSelectedItemChanged(id) {
    selectedItemId.value = id
}

// Return whether or not any item is selected
function isItemSelected() {
    return selectedItem.value !== null
}

// edit dialog
const showEditDialog = ref(false)
const itemForEditDialog = ref(null)

function openEditDialog() {
    itemForEditDialog.value = selectedItem.value
    showEditDialog.value = true
}

function handleChange() {
    showEditDialog.value = false
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
            @close="showEditDialog = false"
            @change="handleChange" />
    </v-dialog>
</template>