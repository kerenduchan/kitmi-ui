<script setup>
import { ref } from 'vue'
import TopBar from '@/components/TopBar.vue'
import PayeesList from '@/components/PayeesList.vue'
import PayeeDialog from '@/components/PayeeDialog.vue'
import getPayees from '@/composables/queries/getPayees'
import getCategories from '@/composables/queries/getCategories'

const {
    payees,
    isReady: isPayeesReady,
    refetch: refetchPayees
} = getPayees()

const {
    categories,
    isReady: isCategoriesReady,
    refetch: refetchCategories
} = getCategories()

const showPayeeDialog = ref(false)
const payeeForDialog = ref(null)
const selectedPayee = ref(null)

function onSelectedPayeeChanged(p) {
    selectedPayee.value = p
}

function closePayeeDialog() {
    showPayeeDialog.value = false
}

function handlePayeeChange() {
    refetchPayees()
    closePayeeDialog()
}

function edit() {
    // "freeze" the payee for the dialog so it doesn't get filtered out
    // in case the payee went from being uncategorized to categorized
    // and "Show Only Uncategorized" is checked
    payeeForDialog.value = selectedPayee.value
    showPayeeDialog.value = true
    
}

function isPayeeSelected() {
    return selectedPayee.value !== null
}

</script>

<template>
    <TopBar>
        <v-btn icon="mdi-pencil" :disabled="!isPayeeSelected()" @click="edit"></v-btn>
    </TopBar>

    <div v-if="!isPayeesReady || !isCategoriesReady">
        Loading...
    </div>

    <div v-else>
        <PayeesList :payees="payees" @selectedItemChanged="onSelectedPayeeChanged" />

        <v-dialog v-model="showPayeeDialog">
            <PayeeDialog :payee="payeeForDialog" :categories="categories" @close="closePayeeDialog"
                @change="handlePayeeChange" />
        </v-dialog>
    </div>
</template>