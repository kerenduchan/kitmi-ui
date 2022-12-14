<script setup>
import { ref, computed } from 'vue'
import PayeesList from '@/components/PayeesList.vue'
import PayeeDialog from '@/components/PayeeDialog.vue'
import getPayees from '@/composables/queries/getPayees'

const {
    payees,
    isReady: isPayeesReady,
    refetch: refetchPayees
} = getPayees()

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

</script>

<template>
    <div v-if="!isPayeesReady">Loading...</div>
    <div v-else>
        <v-checkbox label="Show Only Uncategorized" v-model="showOnlyUncategorized"></v-checkbox>

        <PayeesList :payees="filteredPayees" @click="onPayeeClicked"/>
        <v-dialog v-model="showPayeeDialog">
            <PayeeDialog :payee=payee @close="showPayeeDialog=false"/>
        </v-dialog>
    </div>
</template>