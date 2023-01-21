<script setup>
import { ref, computed, watch } from 'vue'
import CategorizationWizardOnePayee from '@/components/CategorizationWizardOnePayee.vue'
import getUpdatePayee from '@/composables/mutations/updatePayee'
import getPayees from '@/composables/queries/getPayees'
import getTransactionsOfPayee from '@/composables/queries/getTransactionsOfPayee'

const offset = ref(0)
const limit = 10

// params to be passed to getPayees
const payeesParams = computed(() => {
    let params = {
        offset: offset.value,
        limit,
        categorized: false
    }
    return params
})

// get the first chunk of uncategorized payees (pagination)
const { payees, totalPayeesCount, refetch } = getPayees(payeesParams.value) 


// props 
const props = defineProps({
    categories: Object
})

// emits
const emit = defineEmits([
    'close',
    'change'
])



// index into the payees array - 
// the payee that's currently displayed in the wizard
const currentPayeeIdx = ref(0)

// the selected subcategory ID for the currently displayed payee
const selectedSubcategoryId = ref(null)

// whether there's a next payee after the current one
const hasNext = computed(() => {
    return absolutePayeeNumber.value < totalPayeesCount.value
})

// whether there's a previous payee before the current one
const hasPrev = computed(() => {
    return currentPayeeIdx.value > 0
})

// the current payee
const currentPayee = computed(() => {
    if(payees.value === null || payees.value.length === 0) {
        return null
    }
    return payees.value[currentPayeeIdx.value]
})

// params for getTransactionsOfPayee
const transactionsParams = computed(() => {
    return {
        payeeId: currentPayee.value === null ? 0 : parseInt(currentPayee.value.id),
        limit: 100,
        offset: 0
    }
})

const { transactions, totalTransactionsCount, refetch: refetchTransactions } = 
            getTransactionsOfPayee(transactionsParams.value)

watch(currentPayee, () => {
    refetchTransactions(transactionsParams.value)
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
    if(currentPayeeIdx.value === limit - 1) {
        // need to fetch next batch of payees
        offset.value += limit
        refetch(payeesParams.value)
        currentPayeeIdx.value = 0
    } else {
        currentPayeeIdx.value++
    }
}

function close() {
    savePayeeSubcategory()
    emit('close')
}

const { 
    updatePayee, 
    onDone: onUpdatePayeeDone, 
    onError: onUpdatePayeeError 
} = getUpdatePayee()

function savePayeeSubcategory() {

    if(selectedSubcategoryId.value !== null &&
        selectedSubcategoryId.value !== currentPayee.value.subcategoryId) {
        updatePayee({
            payeeId: currentPayee.value.id, 
            subcategoryId: selectedSubcategoryId.value
        })
        emit('change')
    }
}

function handleSubcategorySelected(subcategoryId) {
    selectedSubcategoryId.value = subcategoryId
    if(subcategoryId !== null) {
        if(hasNext.value === true) {
            next()
        } 
    }
}

watch(currentPayee, () => {
    selectedSubcategoryId.value = null
})

const absolutePayeeNumber = computed(() => {
    return currentPayeeIdx.value + offset.value + 1
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
    <v-card v-if="filteredCategories.length > 0 && payees !== null">
        <v-card-title>Categorization Wizard ({{ absolutePayeeNumber }} of {{ totalPayeesCount }})</v-card-title>
        <v-card-text>
            <!-- key forces the component to remount upon change -->
            <CategorizationWizardOnePayee v-if="transactions !== null && transactions.length > 0"
                :key="absolutePayeeNumber"
                :payee="currentPayee" 
                :transactions="transactions"
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