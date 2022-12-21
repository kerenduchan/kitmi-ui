<script setup>
import { ref, computed, watch } from 'vue'
import CategorizationWizardOnePayee from '@/components/CategorizationWizardOnePayee.vue'
import updatePayeeSubcategory from '@/composables/mutations/updatePayeeSubcategory'

// props 
const props = defineProps({
    payeeIds: Object,
    transactionsPerPayeeId: Object,
    payees: Object,
    categories: Object
})

// emits
const emit = defineEmits([
    'close',
    'change'
])

// index into the payeeIds array - 
// the payee that's currently displayed in the wizard
const currentPayeeIdx = ref(0)

// the selected subcategory ID for the currently displayed payee
const selectedSubcategoryId = ref(null)

// whether there's a next payee after the current one
const hasNext = computed(() => {
    return currentPayeeIdx.value < props.payeeIds.length - 1
})

// whether there's a previous payee before the current one
const hasPrev = computed(() => {
    return currentPayeeIdx.value > 0
})

// the current payee
const currentPayee = computed(() => {
    const payeeId = props.payeeIds[currentPayeeIdx.value]
    const found = props.payees.find(p => p.id === payeeId)
    return found ? found : null
})

// only the categories that have subcategories
const filteredCategories = computed(() => {
    return props.categories.filter(c => c.hasSubcategories)
})

function prev() {
    savePayeeSubcategory()
    currentPayeeIdx.value--
}

function next() {
    savePayeeSubcategory()
    currentPayeeIdx.value++
}

function close() {
    savePayeeSubcategory()
    emit('close')
}

const { 
    gqlUpdatePayeeSubcategory, 
    onDone: onUpdatePayeeDone, 
    onError: onUpdatePayeeError 
} = updatePayeeSubcategory()

function savePayeeSubcategory() {

    if(selectedSubcategoryId.value !== null &&
        selectedSubcategoryId.value !== currentPayee.value.subcategoryId) {
        gqlUpdatePayeeSubcategory({
            payeeId: currentPayee.value.id, 
            subcategoryId: selectedSubcategoryId.value
        })
        emit('change')
    }
}

function handleSubcategorySelected(subcategoryId) {
    selectedSubcategoryId.value = subcategoryId
    if(subcategoryId !== null) {
        next()
    }
}

watch(currentPayee, () => {
    selectedSubcategoryId.value = null
})

</script>

<template>
    <!-- show this if there are no subcategories -->
    <v-card v-if="filteredCategories.length === 0">
        <v-card-title>
            Categorization Wizard
        </v-card-title>
        <v-card-text>
            Define some categories and subcategories first.
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" @click="close">Close</v-btn>
        </v-card-actions>
    </v-card>

    <!-- show this if there are subcategories -->
    <v-card v-else>
        <v-card-title>Categorization Wizard</v-card-title>
        <v-card-text>
            <!-- key forces the component to remount upon change -->
            <CategorizationWizardOnePayee 
                :key="currentPayeeIdx"
                :payee="currentPayee" 
                :transactions="transactionsPerPayeeId[currentPayeeIdx]"
                :categories="filteredCategories"
                @subcategorySelected="handleSubcategorySelected"
            />
        </v-card-text>

        <v-card-actions>
            <v-btn color="primary" :disabled="!hasPrev" @click="prev">Previous</v-btn>
            <v-btn color="primary" :disabled="!hasNext" @click="next">Next</v-btn>
            <v-btn color="primary" @click="close">Close</v-btn>
        </v-card-actions>
    </v-card>

</template>