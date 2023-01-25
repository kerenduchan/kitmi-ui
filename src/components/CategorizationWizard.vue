<script setup>
import { ref, computed, watch } from 'vue'

// components
import CategorizationWizardOnePayee from '@/components/CategorizationWizardOnePayee.vue'

// composables
import getUpdatePayee from '@/composables/mutations/updatePayee'
import getPayees from '@/composables/queries/getPayees'
import Payee from '@/composables/model/Payee'

// props 
const props = defineProps({
    categories: Object
})

// emits
const emit = defineEmits([
    'close',
    'change'
])

// params to be passed to getPayees
const payeesParams = computed(() => {
    let params = {
        categorized: false
    }
    return params
})

const payees = ref(null)
const totalPayeesCount = ref(null)
const isLoading = ref(true)

// get the first chunk of uncategorized payees (pagination)
const { onResult } = getPayees(payeesParams.value) 


onResult(res => {
    payees.value = res.data.payees.items.map((p) => new Payee(p))
    totalPayeesCount.value = res.data.payees.totalItemsCount
    isLoading.value = false
})

// index into the payees array - 
// the payee that's currently displayed in the wizard
const currentPayeeIdx = ref(0)

// the current payee
const currentPayee = computed(() => {
    if(payees.value === null || payees.value.length === 0) {
        return null
    }
    return payees.value[currentPayeeIdx.value]
})

// the selected subcategory ID for the currently displayed payee
const selectedSubcategoryId = ref(null)

// whether there's a next payee after the current one
const hasNext = computed(() => {
    return currentPayeeIdx.value < totalPayeesCount.value - 1
})

// whether there's a previous payee before the current one
const hasPrev = computed(() => {
    return currentPayeeIdx.value > 0
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

const title = computed(() => {
    let res = "Categorization Wizard"
    if(filteredCategories.value.length === 0) {
        return res
    }
    res += ': '
    if(isLoading.value) {
        return res
    }
    if(totalPayeesCount.value === 0) {
        res += 'nothing to categorize'
        return res
    }

    res += '' + (currentPayeeIdx.value + 1) + ' of ' + totalPayeesCount.value
    return res
})
</script>

<template>
    <v-card>
        <v-card-title>{{ title }}</v-card-title>
        <v-card-text>
            <div v-if="filteredCategories.length === 0">
                Define some categories and subcategories first.
            </div>
            <div v-else>
                <!-- key forces the component to remount upon change -->
                <CategorizationWizardOnePayee v-if="currentPayee"
                    :key="currentPayeeIdx"
                    :payee="currentPayee" 
                    :categories="filteredCategories"
                    @subcategorySelected="handleSubcategorySelected"
                />
            </div>
        </v-card-text>

        <v-card-actions>
            <v-btn color="primary" v-if="filteredCategories.length > 0" :disabled="!hasPrev" @click="prev">Previous</v-btn>
            <v-btn color="primary" v-if="filteredCategories.length > 0" :disabled="!hasNext" @click="next">Next</v-btn>
            <v-btn color="primary" @click="close">Close</v-btn>
        </v-card-actions>
    </v-card>

</template>