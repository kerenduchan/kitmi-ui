<script setup>
import { ref, computed } from 'vue'
import ButtonWithTooltip from '@/components/ButtonWithTooltip.vue';
import CategorizationWizard from '@/components/CategorizationWizard.vue';
import PayeesList from '@/components/PayeesList.vue'
import EditPayee from '@/components/EditPayee.vue'
import getStore from '@/composables/store'

const store = getStore()
const categories = store.categories
const payees = store.payees

// Show only uncategorized filter (v-model for checkbox)
const uncategorized = ref(false)

const uncategorizedPayees = computed(() => {
    return payees.value.filter(p => !p.isCategorized)
})

// The payees, after applying the filter
const filteredPayees = computed(() => {
    if(uncategorized.value === true) {
        return uncategorizedPayees.value
    }
    return payees.value
})

// the ID of the selected payee
const selectedPayeeId = ref(null)

// The selected payee
const selectedPayee = computed(() => {
    if(selectedPayeeId.value === null) {
        return null
    }
    const found = filteredPayees.value.find(p => p.id === selectedPayeeId.value)
    return found ? found : null
})

// update the selected payee
function handleSelect(id) {
    selectedPayeeId.value = id
}

// edit dialog
const showEditDialog = ref(false)

function handleChange() {
    showEditDialog.value = false
    store.refetchPayees()
}

const showCategorizationWizard = ref(false)

const payeeIdsForCategorizationWizard = ref(null)
const transactionsForCategorizationWizard = ref(null)

function openCategorizationWizard() {
    // "freeze" the list of IDs of payees that are currently uncategorized, for the wizard
    // so that prev/next can go back to a payee that has been categorized using the wizard
    payeeIdsForCategorizationWizard.value = uncategorizedPayees.value.map(p => p.id)

    // in the same order as the payeeIdsForCategorizationWizard array, get
    // the transactions of each payee
    transactionsForCategorizationWizard.value = 
        payeeIdsForCategorizationWizard.value.map(payeeId => store.getTransactionsForPayeeId(payeeId))

    showCategorizationWizard.value = true
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
                    :disabled="selectedPayee === null"
                    @click="showEditDialog = true"
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

        <div class="top-bar-right">

            <!-- Open categorization wizard button -->
            <div class="top-bar-action">
                <ButtonWithTooltip 
                    tooltip="Categorization wizard" 
                    icon="mdi-wizard-hat"
                    :disabled="uncategorizedPayees.length === 0"
                    @click="openCategorizationWizard"
                />
            </div>
        </div>
    </div>
    <v-divider />

    <!-- List (table) of payees -->
    <PayeesList 
        :payees="filteredPayees" 
        @select="handleSelect" />

    <!-- Edit selected payee dialog -->
    <v-dialog v-model="showEditDialog">
        <EditPayee 
            :payee="selectedPayee"
            :categories="categories"
            @close="showEditDialog = false"
            @change="handleChange" />
    </v-dialog>

    <!-- Categorization wizard -->
    <v-dialog fullscreen v-model="showCategorizationWizard">
        <CategorizationWizard
            :payeeIds="payeeIdsForCategorizationWizard"
            :transactionsPerPayeeId="transactionsForCategorizationWizard"
            :payees="payees"
            :categories="categories"
            @close="showCategorizationWizard = false"
            @change="store.refetchPayees()"
        />
    </v-dialog>

</template>