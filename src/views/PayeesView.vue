<script setup>
import { ref, computed, watch } from 'vue'

// components
import ButtonWithTooltip from '@/components/ButtonWithTooltip.vue'
import Snackbar from '@/components/Snackbar.vue'
import CategorizationWizard from '@/components/CategorizationWizard.vue'
import PayeesList from '@/components/PayeesList.vue'
import EditPayee from '@/components/EditPayee.vue'

// composables
import snackbar from '@/composables/snackbar'
import getUpdatePayee from '@/composables/mutations/updatePayee'
import getPayeesAndCategories from '@/composables/queries/getPayeesAndCategories'
import Category from '@/composables/model/Category'
import Payee from '@/composables/model/Payee'

// ----------------------------------------------------------------------------

// Show only uncategorized filter (v-model for checkbox)
const uncategorized = ref(false)

const subtitle = computed(() => {
    return uncategorized.value ? 'Uncategorized' : ''
})

// ----------------------------------------------------------------------------
// get payees with pagination
const limit = 20

// the current page (v-model for the v-pagination)
const page = ref(1)

const getCategories = ref(false)

// params to be passed to getPayees
const gqlParams = computed(() => {
    let params = {
        offset: (page.value - 1) * limit,
        limit,
        categorized: uncategorized.value ? false : null,
        getCategories: getCategories.value
    }
    return params
})

const payees = ref(null)
const categories = ref(null)
const totalPayeesCount = ref(null)

// get the first page of payees (pagination) + all categories
const { onResult, refetch } = getPayeesAndCategories(gqlParams.value) 

onResult(res => {
    categories.value = res.data.categories.map((p) => new Category(p))
    payees.value = res.data.payees.items.map((p) => new Payee(p))
    totalPayeesCount.value = res.data.payees.totalItemsCount
    // get categories only the first time
    getCategories.value = false
})


function refresh() {
    refetch(gqlParams.value)
}

const pagesCount = computed(() => {
    return Math.ceil(parseFloat(totalPayeesCount.value) / limit)
})

watch(page, () => {
    // selected page changed
    refresh()
})

watch(uncategorized, () => {
    // uncategorized checkbox changed
    refresh()
})

// ----------------------------------------------------------------------------
// snackbar

const { showSnackbar, snackbarText, displaySnackbar } = snackbar()

// ----------------------------------------------------------------------------
// selected payee

// the ID of the selected payee
const selectedPayeeId = ref(null)

// The selected payee
const selectedPayee = computed(() => {
    if(!selectedPayeeId.value) {
        return null
    }
    const found = payees.value.find(p => p.id === selectedPayeeId.value)
    return found ? found : null
})

// update the selected payee
function handleSelect(id) {
    selectedPayeeId.value = id
}

// ----------------------------------------------------------------------------
// edit payee

const showEditDialog = ref(false)

const { 
    updatePayee, 
    onDone: onUpdatePayeeDone, 
    onError: onUpdatePayeeError 
} = getUpdatePayee()

onUpdatePayeeDone((res) => {
    showEditDialog.value = false
    refresh()
    displaySnackbar("Payee '" + selectedPayee.value.name + "' updated.")
})

onUpdatePayeeError((e) => {
    displaySnackbar("Failed to update payee '" + selectedPayee.value.name + "'.")
    console.error(e)
})

// ----------------------------------------------------------------------------
// categorization wizard

const showCategorizationWizard = ref(false)


</script>

<template>
    <div class="top-bar">
        <div class="top-bar-left">

            <!-- Edit button -->
            <div class="top-bar-action">
                <ButtonWithTooltip 
                    tooltip="Edit payee" 
                    icon="mdi-pencil"
                    :disabled="!selectedPayee"
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
                    :disabled="!payees || payees.length === 0"
                    @click="showCategorizationWizard = true"
                />
            </div>
        </div>
    </div>
    <v-divider />

    <v-container fluid>
        <v-row dense>
            <v-col>
                <v-card  v-if="payees" title="Payees" :subtitle="subtitle">
                    <v-card-text>
                        <!-- List (table) of payees -->
                        <PayeesList 
                            :selectedPayeeId="selectedPayeeId"
                            :payees="payees" 
                            @select="handleSelect" />

                        <!-- pagination -->
                        <v-pagination 
                            v-model="page"
                            :length="pagesCount"
                            circle 
                        />
    
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>

    <!-- snackbar -->
    <Snackbar 
        :show="showSnackbar" 
        :text="snackbarText"
        @close="showSnackbar = false"/>

    <!-- Edit selected payee dialog -->
    <v-dialog v-model="showEditDialog">
        <EditPayee 
            :payee="selectedPayee"
            :categories="categories"
            @close="showEditDialog = false"
            @save="updatePayee" />
    </v-dialog>

    <!-- Categorization wizard -->
    <v-dialog fullscreen v-model="showCategorizationWizard">
        <CategorizationWizard
            :categories="categories"
            @close="showCategorizationWizard = false"
            @change="refresh"
        />
    </v-dialog>

</template>