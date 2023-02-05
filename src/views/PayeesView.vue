<script setup>
import { ref, computed, watch } from 'vue'

// components
import ActionsBar from '@/components/layout/ActionsBar.vue'
import Actions from '@/components/layout/Actions.vue'
import ViewContent from '@/components/layout/ViewContent.vue'
import ViewContentTitle from '@/components/layout/ViewContentTitle.vue'
import ViewContentSubtitle from '@/components/layout/ViewContentSubtitle.vue'
import ViewContentMain from '@/components/layout/ViewContentMain.vue'

import ButtonWithTooltip from '@/components/ButtonWithTooltip.vue'
import Snackbar from '@/components/Snackbar.vue'
import WizardLoader from '@/components/payeesCategorizationWizard/WizardLoader.vue'
import PayeesList from '@/components/PayeesList.vue'
import EditPayee from '@/components/EditPayee.vue'
import FilterPayees from '@/components/FilterPayees.vue'

// composables
import snackbar from '@/composables/snackbar'
import getUpdatePayee from '@/composables/mutations/updatePayee'
import getPayeesAndCategories from '@/composables/queries/getPayeesAndCategories'
import Category from '@/composables/model/Category'
import Payee from '@/composables/model/Payee'

// ----------------------------------------------------------------------------

// Show only uncategorized filter (v-model for checkbox)
const uncategorized = ref(false)

// ----------------------------------------------------------------------------
// get payees with pagination
const limit = 50

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

const scrollable = ref(null)

onResult(res => {
    categories.value = res.data.categories.map((p) => Category.fromGql(p))
    payees.value = res.data.payees.items.map((p) => Payee.fromGql(p))
    totalPayeesCount.value = res.data.payees.totalItemsCount
    // get categories only the first time
    getCategories.value = false
    if (scrollable.value) {
        scrollable.value.scrollTo(0, 0)
    }
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

// ----------------------------------------------------------------------------
// snackbar

const { showSnackbar, snackbarText, displaySnackbar } = snackbar()

// ----------------------------------------------------------------------------
// selected payee

// the ID of the selected payee
const selectedPayeeId = ref(null)

// The selected payee
const selectedPayee = computed(() => {
    if (!selectedPayeeId.value) {
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
// edit payee / update payee from wizard

const showEditDialog = ref(false)

const {
    updatePayee,
    onDone: onUpdatePayeeDone,
    onError: onUpdatePayeeError
} = getUpdatePayee()

const payeeBeingUpdated = ref(null)

function doUpdatePayee(payee, params) {
    payeeBeingUpdated.value = payee
    updatePayee(params)
}

onUpdatePayeeDone(() => {
    showEditDialog.value = false
    refresh()
    displaySnackbar("Payee '" + payeeBeingUpdated.value.name + "' updated.")
    payeeBeingUpdated.value = null
})

onUpdatePayeeError((e) => {
    displaySnackbar("Failed to update payee '" + payeeBeingUpdated.value.name + "'.")
    console.error(e)
    payeeBeingUpdated.value = null
})

// ----------------------------------------------------------------------------
// categorization wizard

const showCategorizationWizard = ref(false)

// ----------------------------------------------------------------------------
// filter payees

const showFilterDialog = ref(false)

const filterDefaults = computed(() => {
    return {
        uncategorized: uncategorized.value
    }
})

function applyFilter(filter) {
    showFilterDialog.value = false
    uncategorized.value = filter.uncategorized
    page.value = 1
    refresh()
}

const subtitle = computed(() => {
    return uncategorized.value ? 'Uncategorized payees' : 'All payees'
})

</script>

<template>
    <!-- actions bar at the top -->
    <ActionsBar>

        <!-- actions at the start of the actions bar -->
        <Actions>
            <!-- Edit button -->
            <ButtonWithTooltip tooltip="Edit payee" icon="mdi-pencil" :disabled="!selectedPayee"
                @click="showEditDialog = true" />
        </Actions>

        <!-- actions at the end of the actions bar -->
        <Actions>

            <!-- Filter -->
            <ButtonWithTooltip tooltip="Filter" icon="mdi-filter" @click="showFilterDialog = true" />

            <!-- Open categorization wizard button -->
            <ButtonWithTooltip tooltip="Categorization wizard" icon="mdi-wizard-hat"
                @click="showCategorizationWizard = true" />
        </Actions>

    </ActionsBar>

    <!-- content, below the actions bar -->
    <ViewContent v-if="payees">

        <!-- content title -->
        <ViewContentTitle text="Payees" />
        <ViewContentSubtitle :text="subtitle" @click="showFilterDialog = true"/>

        <!-- content body -->
        <ViewContentMain noscroll>
            <div class="mb-5 flex-grow-1 d-flex flex-column overflow-y-hidden rounded">
                <div class="flex-grow-1 overflow-y-auto" ref="scrollable">
                    <!-- List (table) of payees -->
                    <PayeesList :selectedPayeeId="selectedPayeeId" :payees="payees" @select="handleSelect" />
                </div>
                <div class="d-flex justify-center bg-primary">
                    <v-pagination density="compact" v-model="page" :length="pagesCount" total-visible="10" circle />
                </div>
            </div>
        </ViewContentMain>
    </ViewContent>

    <!-- snackbar -->
    <Snackbar :show="showSnackbar" :text="snackbarText" @close="showSnackbar = false" />

    <!-- Edit selected payee dialog -->
    <v-dialog v-model="showEditDialog" width="800">
        <EditPayee :payee="selectedPayee" :categories="categories" @close="showEditDialog = false"
            @save="doUpdatePayee" />
    </v-dialog>

    <!-- Filter payees dialog -->
    <v-dialog v-model="showFilterDialog" width="800">
        <FilterPayees
            :defaults="filterDefaults"
            @close="showFilterDialog = false"
            @filter="applyFilter"
        />
    </v-dialog>


    <!-- Categorization wizard -->
    <v-dialog persistent height="100%" v-model="showCategorizationWizard">
        <WizardLoader :categories="categories" @updatePayee="doUpdatePayee" @done="showCategorizationWizard = false" />
    </v-dialog>

</template>