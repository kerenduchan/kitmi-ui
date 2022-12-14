<script setup>
import { ref, computed } from 'vue'
import PayeesList from '@/components/PayeesList.vue'
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

</script>

<template>
    <div v-if="!isPayeesReady">Loading...</div>
    <div v-else>
        <v-checkbox label="Show Only Uncategorized" v-model="showOnlyUncategorized"></v-checkbox>

        <PayeesList :payees="filteredPayees" />
    </div>
</template>
