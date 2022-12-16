<script setup>
import { ref } from 'vue'
import TopBar from '@/components/TopBar.vue'
import PayeesList from '@/components/PayeesList.vue'
import PayeeDialog from '@/components/PayeeDialog.vue'
import getPayees from '@/composables/queries/getPayees'
import getCategories from '@/composables/queries/getCategories'

const {
    payees: items,
    isReady: isItemsReady,
    refetch: refetchItems
} = getPayees()

const {
    categories,
    isReady: isCategoriesReady,
    refetch: refetchCategories
} = getCategories()

const selectedItem = ref(null)
const showEditDialog = ref(false)
const itemForEditDialog = ref(null)

function isItemSelected() {
    return selectedItem.value !== null
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

function handleSelectedItemChanged(t) {
    selectedItem.value = t
}

function handleChange() {
    closeEditDialog()
    refetchItems()
}

</script>

<template>
    <TopBar>
        <v-btn icon="mdi-pencil" :disabled="!isItemSelected()" @click="openEditDialog"></v-btn>
    </TopBar>

    <div v-if="!isItemsReady || !isCategoriesReady">
        Loading...
    </div>

    <div v-else>
        <PayeesList :items="items" @selectedItemChanged="handleSelectedItemChanged" />

        <v-dialog v-model="showEditDialog">
            <PayeeDialog 
                :item="itemForEditDialog"
                :categories="categories"
                @close="closeEditDialog"
                @change="handleChange" />
        </v-dialog>
    </div>
</template>