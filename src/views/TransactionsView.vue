<script setup>
import { ref, computed } from 'vue'
import ButtonWithTooltip from '@/components/ButtonWithTooltip.vue';
import TransactionsList from '@/components/TransactionsList.vue'
import EditTransaction from '@/components/EditTransaction.vue'
import getStore from '@/composables/store'

const store = getStore()
const categories = store.categories
const items = store.transactions

// Show only uncategorized filter (v-model for checkbox)
const uncategorized = ref(false)

// The items, after applying the filter
const filteredItems = computed(() => {
    if(uncategorized.value === true) {
        return items.value.filter(item => !item.isCategorized)
    }
    return items.value
})

// The ID of the selected item
const selectedItemId = ref(null)

// The selected item
const selectedItem = computed(() => {
    if(selectedItemId.value === null) {
        return null
    }
    const found = filteredItems.value.find(item => item.id === selectedItemId.value)
    return found ? found : null
})

// update the selected item ID
function handleSelectedItemChanged(id) {
    selectedItemId.value = id
}

// edit dialog
const showEditDialog = ref(false)
const itemForEditDialog = ref(null)

function openEditDialog() {
    itemForEditDialog.value = selectedItem.value
    showEditDialog.value = true
}

function handlePayeeChange() {
    showEditDialog.value = false
    store.refetchPayees()
}

function handleTransactionChange() {
    showEditDialog.value = false
    store.refetchTransactions()
}

</script> 

<template>
    <div class="top-bar">
        <div class="top-bar-left">

            <!-- Edit button -->
            <div class="top-bar-action">
                <ButtonWithTooltip 
                    tooltip="Edit transaction" 
                    icon="mdi-pencil"
                    :disabled="selectedItem === null"
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

    <!-- List (table) of transactions -->
    <TransactionsList 
        :items="filteredItems" 
        @selectedItemChanged="handleSelectedItemChanged"/>

    <!-- Edit selected transaction dialog -->
    <v-dialog v-model="showEditDialog">
        <EditTransaction 
            :item="itemForEditDialog"
            :categories="categories" 
            @close="showEditDialog = false"
            @payeeChanged="handlePayeeChange" 
            @transactionChanged="handleTransactionChange" 
        />
    </v-dialog>

</template>
