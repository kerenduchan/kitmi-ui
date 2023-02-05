<script setup>
import { ref, computed, watch } from 'vue'

// components
import PayeesList from './PayeesList.vue'
import PayeeVue from './Payee.vue'
import AreYouSure from '../AreYouSure.vue'

const props = defineProps({
    payees: Object,
    categories: Object
})

const emit = defineEmits([
    'updatePayee',
    'done'
])

//--------------------------------------------------------------------------------------
// the current payee

// index in the payees array of the current payee
const curPayeeIdx = ref(0)

// the current payee
const curPayee = computed(() => {
    return props.payees[curPayeeIdx.value]
})

watch(curPayee, () => {
    selectedCategoryId.value = curPayee.value.categoryId
    selectedSubcategoryId.value = curPayee.value.subcategoryId
})

const leavePayeeToIdx = ref(null)

function handlePayeeSelected(payeeIdx) {
    handleLeavePayee(payeeIdx)
}

// needed in order to determine whether the payee is partially categorized
const selectedCategoryId = ref(null)
const selectedSubcategoryId = ref(null)

function handleCategorySelected(categoryId) {
    selectedCategoryId.value = categoryId
}

function handleSubcategorySelected(subcategoryId) {
    selectedSubcategoryId.value = subcategoryId
    if(subcategoryId === curPayee.value.subcategoryId || isPayeePartiallyCategorized.value) {
        return
    }
    emit('updatePayee',
        curPayee.value,
        {
            payeeId: curPayee.value.id,
            subcategoryId
        })

    if (subcategoryId !== null) {
        const idx = findNextUncategorized()
        if (idx !== -1) {
            setTimeout(() => {
                handleLeavePayee(idx)
            }, 400)
        }
    }
}

function findNextUncategorized() {
    for (let i = curPayeeIdx.value + 1; i < props.payees.length; i++) {
        if (props.payees[i].subcategory === null) {
            return i
        }
    }
    return -1
}

const isPayeePartiallyCategorized = computed(() => {
    return selectedCategoryId.value !== null && selectedSubcategoryId.value === null
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
    return 'Payees Categorization Wizard (' +
        (curPayeeIdx.value + 1) + ' of ' + props.payees.length + ')'
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
    return curPayeeIdx.value < props.payees.length - 1
})

function next() {
    handleLeavePayee(curPayeeIdx.value + 1)
}

//--------------------------------------------------------------------------------------
// done

function done() {
    emit('done');
}

//--------------------------------------------------------------------------------------
// partially categorized dialog
const showPartiallyCategorizedDialog = ref(false)

function handlePartiallyCategorizedDialogYes() {
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
            <PayeesList :payees="payees" :payee="curPayee" @select="handlePayeeSelected" />

            <!-- the current payee being categorized -->
            <!-- key forces the component to remount upon change -->
            <PayeeVue :key="curPayeeIdx" :payee="curPayee" :categories="categories"
                @categorySelected="handleCategorySelected" @subcategorySelected="handleSubcategorySelected" />

        </v-card-text>

        <!-- Actions (prev, nex, done) -->
        <v-card-actions>
            <v-btn :disabled="!hasPrev" @click="prev">Previous</v-btn>
            <v-btn :disabled="!hasNext" @click="next">Next</v-btn>
            <v-btn :disabled="isPayeePartiallyCategorized" @click="done">Done</v-btn>
        </v-card-actions>
    </v-card>

    <!-- DIALOGS ---------------------------------------------------------------------------------------->

    <!-- dialog for when a payee is not fully categorized and then clicked away from -->
    <v-dialog v-model="showPartiallyCategorizedDialog" width="600px">
        <AreYouSure :title="curPayee.name" :message="'A subcategory was not selected. Clear the selected category?'"
            @yes="handlePartiallyCategorizedDialogYes" @cancel="handlePartiallyCategorizedDialogCancel" />
    </v-dialog>

</template>