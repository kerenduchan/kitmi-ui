<script setup>
import { ref, computed } from 'vue'
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
    showPayeeDialog.value = true
}

function isPayeeSelected() {
    return selectedPayee.value !== null
}

</script>

<template>
    <v-container height="100px">
        <v-btn icon="mdi-pencil" :disabled="!isPayeeSelected()" @click="edit"></v-btn>
    </v-container>
    <v-divider></v-divider>

    <div v-if="!isPayeesReady || !isCategoriesReady">
        Loading...
    </div>

    <div v-else>
        <PayeesList :payees="payees" @selectedPayeeChanged="onSelectedPayeeChanged" />

        <v-dialog v-model="showPayeeDialog">
            <PayeeDialog :payee="selectedPayee" :categories="categories" @close="closePayeeDialog"
                @change="handlePayeeChange" />
        </v-dialog>
    </div>
</template>