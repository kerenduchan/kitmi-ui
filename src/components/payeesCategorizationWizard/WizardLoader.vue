<script setup>
import { ref } from 'vue'

// components
import Wizard from './Wizard.vue'

// composables
import getPayees from '@/composables/queries/getPayees'
import Payee from '@/composables/model/Payee'

const props = defineProps({
    categories: Object
})

const emit = defineEmits([
    'updatePayee',
    'done'
])

// the uncategorized payees
const payees = ref(null)

// get all uncategorized payees
const { onResult } = getPayees({
    categorized: false
})

const showNoUncategorizedPayeesDialog = ref(false)

onResult(res => {
    payees.value = res.data.payees.items.map((p) => Payee.fromGql(p))
    if(payees.value.length === 0) {
        showNoUncategorizedPayeesDialog.value = true
    }
})

function handleUpdatePayee(payee, params) {
    emit('updatePayee', payee, params)
}

function handleNoUncategorizedPayeesDialogOk() {
    showNoUncategorizedPayeesDialog.value = false
    done()
}

function done() {
    emit('done')
}

</script>

<template>
    <template v-if="payees">
        <v-dialog v-model="showNoUncategorizedPayeesDialog" width="400px">
            <v-card title="Categorization Wizard" text="There are no uncategorized payees.">
                <v-card-actions>
                    <v-btn @click="handleNoUncategorizedPayeesDialogOk">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <Wizard v-if="payees.length > 0" :payees="payees" :categories="categories" @done="done" @updatePayee="handleUpdatePayee"/>
        
    </template>

    
</template>