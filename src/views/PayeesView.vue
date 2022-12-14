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

const showOnlyUncategorized = ref(false)

const filteredPayees = computed(() => {
    if(showOnlyUncategorized.value) {
        return payees.value.filter(p => p.isUncategorized)
    }
    return payees.value
})

const showPayeeDialog = ref(false)
const payee = ref(null)

function onPayeeClicked(p) {
    showPayeeDialog.value = true
    payee.value = p
}

function closePayeeDialog() {
    showPayeeDialog.value = false
}

function handlePayeeChange() {
    refetchPayees()
    closePayeeDialog()
}

</script>

<template>
    <div v-if="!isPayeesReady || !isCategoriesReady">Loading...</div>
    <div v-else>
        <v-checkbox label="Show Only Uncategorized" v-model="showOnlyUncategorized"></v-checkbox>

        <PayeesList :payees="filteredPayees" @click="onPayeeClicked"/>
        <v-dialog v-model="showPayeeDialog">
            <PayeeDialog 
                :payee="payee" 
                :categories="categories" 
                @close="closePayeeDialog"
                @change="handlePayeeChange"
            />
        </v-dialog>
    </div>
</template>