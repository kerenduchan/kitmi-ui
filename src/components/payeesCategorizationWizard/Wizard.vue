<script setup>
import { ref, computed } from 'vue'

// components
import PayeesList from './PayeesList.vue'
import PayeeVue from './Payee.vue'
import AreYouSure from '../AreYouSure.vue'

// composables
import PayeeDraft from '@/composables/model/PayeeDraft'

const props = defineProps({
    payees: Object,
    categories: Object
})

const emit = defineEmits([
    'save',
    'cancel'
])

//--------------------------------------------------------------------------------------
// a draft of uncategorized payees, with edits being made in this wizard session
const payeesDraft = ref(props.payees.map(p => new PayeeDraft(p)))
console.log(payeesDraft.value)
//--------------------------------------------------------------------------------------
// the current payee

// index in the payeesDraft array of the current payee
const curPayeeIdx = ref(0)

// the current payee
const curPayeeDraft = computed(() => {
    if (payeesDraft !== null) {
        return payeesDraft.value[curPayeeIdx.value]
    }
})

const leavePayeeToIdx = ref(null)

function handlePayeeSelected(payeeIdx) {
    handleLeavePayee(payeeIdx)
}

function handleCategorySelected(category) {
    curPayeeDraft.value.category = category
}

function handleSubcategorySelected(subcategory) {
    curPayeeDraft.value.subcategory = subcategory
}

// transactions of the current payee
const transactions = ref([])

const isPayeePartiallyCategorized = computed(() => {
    return curPayeeDraft.value.category !== null && curPayeeDraft.value.subcategory === null
})

function handleLeavePayee(toIdx) {
    if (isPayeePartiallyCategorized.value) {
        // a category was selected but a subcategory was not
        leavePayeeToIdx.value = toIdx
        showPartiallyCategorizedDialog.value = true
    } else {
        curPayeeIdx.value = toIdx
    }
}

//--------------------------------------------------------------------------------------
// title
const title = computed(() => {
    let res = 'Wizard'
    if (payeesDraft.value && payeesDraft.value.length > 0) {
        res += ' (' + (curPayeeIdx.value + 1) + ' of ' + payeesDraft.value.length + ')'
    }
    return res
})

//--------------------------------------------------------------------------------------
// prev
const hasPrev = computed(() => {
    return curPayeeIdx.value > 0
})

function prev() {
    handleLeavePayee(curPayeeIdx.value - 1)
}

//--------------------------------------------------------------------------------------
// next
const hasNext = computed(() => {
    return payeesDraft.value !== null && curPayeeIdx.value < payeesDraft.value.length - 1
})

function next() {
    handleLeavePayee(curPayeeIdx.value + 1)

}

//--------------------------------------------------------------------------------------
// save
const showSaveDialog = ref(false)

function save() {
    showSaveDialog.value = true
}

function handleSaveDialogYes() {
    emit('save', payeesDraft.value)
}

//--------------------------------------------------------------------------------------
// discard changes
const showDiscardChangesDialog = ref(false)

function discardChanges() {
    showDiscardChangesDialog.value = true
}

function handleDiscardChangesDialogYes() {
    showDiscardChangesDialog.value = false
    emit('cancel')
}

//--------------------------------------------------------------------------------------
// partially categorized dialog
const showPartiallyCategorizedDialog = ref(false)

function handlePartiallyCategorizedDialogYes() {
    curPayeeDraft.value.category = null
    showPartiallyCategorizedDialog.value = false
    curPayeeIdx.value = leavePayeeToIdx.value
    leavePayeeToIdx.value = null
}

function handlePartiallyCategorizedDialogCancel() {
    showPartiallyCategorizedDialog.value = false
    leavePayeeToIdx.value = null
}

</script>

<template>
    <!-- outermost card for the wizard -->
    <v-card class="flex-grow-1">

        <!-- title -->
        <v-card-title>{{ title }}</v-card-title>

        <v-card-text class="overflow-y-hidden d-flex">

            <!-- scrollable list of payees -->
            <PayeesList :payeesDraft="payeesDraft" :payeeDraft="curPayeeDraft" @select="handlePayeeSelected" />

            <!-- the current payee being categorized -->
            <!-- key forces the component to remount upon change -->
            <PayeeVue :key="curPayeeIdx" :payeeDraft="curPayeeDraft" :transactions="transactions" :categories="categories"
                @categorySelected="handleCategorySelected" @subcategorySelected="handleSubcategorySelected" />

        </v-card-text>

        <!-- Actions (prev, nex, save, discard) -->
        <v-card-actions>
            <v-btn :disabled="!hasPrev" @click="prev">Previous</v-btn>
            <v-btn :disabled="!hasNext" @click="next">Next</v-btn>
            <v-btn :disabled="isPayeePartiallyCategorized" @click="save">Save</v-btn>
            <v-btn @click="discardChanges">Discard Changes</v-btn>
        </v-card-actions>
    </v-card>

    <!-- DIALOGS ---------------------------------------------------------------------------------------->

    <!-- dialog for when a payee is not fully categorized and then clicked away from -->
    <v-dialog v-model="showPartiallyCategorizedDialog" width="600px">
        <AreYouSure :title="curPayeeDraft.name"
            :message="'A subcategory was not selected. Clear the selected category?'"
            @yes="handlePartiallyCategorizedDialogYes" @cancel="handlePartiallyCategorizedDialogCancel" />
    </v-dialog>

    <!-- dialog for when save is clicked -->
    <v-dialog v-model="showSaveDialog" width="600px">
        <AreYouSure title="Save" :message="'Save changes?'" @yes="handleSaveDialogYes"
            @cancel="showSaveDialog = false" />
    </v-dialog>

    <!-- dialog for when discard changes is clicked -->
    <v-dialog v-model="showDiscardChangesDialog" width="600px">
        <AreYouSure title="Discard Changes" :message="'All changes will be lost! Proceed?'"
            @yes="handleDiscardChangesDialogYes" @cancel="showDiscardChangesDialog = false" />
    </v-dialog>

</template>