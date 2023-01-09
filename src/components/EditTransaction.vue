<script setup>
import { ref, computed } from 'vue'
import IconWithTooltip from '@/components/IconWithTooltip.vue'
import EditTransactionCategorization from '@/components/EditTransactionCategorization.vue'
import EditText from '@/components/EditText.vue'

// props 
const props = defineProps({
    transaction: Object,
    categories: Object
})

const emit = defineEmits([
    'close',
    'save',
])

const showEditCategorizationDialog = ref(false)
const showEditNoteDialog = ref(false)

function save(transaction) {
    showEditCategorizationDialog.value = false
    emit('save', transaction)
}

function saveNote(note) {
    showEditNoteDialog.value = false
    const transaction = {
        transactionId: props.transaction.id,
        subcategoryId: props.transaction.subcategoryId,
        overrideSubcategory: props.transaction.overrideSubcategory,
        note
    }
    emit('save', transaction)
}

const fields = ref([
{
        label: 'ID',
        value: props.transaction.id
    },
    {
        label: 'Payee',
        value: props.transaction.payee.name
    },
    {
        label: 'Amount',
        value: props.transaction.formattedAmount
    },
    {
        label: 'Date',
        value: props.transaction.formattedDate
    },
    {
        label: 'Account',
        value: props.transaction.account.name
    },
])

const transactionCategorization = computed(() => {
    if(props.transaction.category) {
        return props.transaction.categoryName + ': ' + props.transaction.subcategoryName
    } else {
        return 'Uncategorized'
    }
})

const categorizationTooltip = computed(() => {
    if(props.transaction.overrideSubcategory) {
        return "Overrides Payee's categorization (" + props.transaction.payeeCategorizationStr + ")"
    }
    return null
})

</script>

<template>
    <v-card>
        <v-card-title>Transaction Details</v-card-title>
        <v-card-text>
            <v-table density="compact">
                <tbody>
                    <tr v-for="f in fields">
                        <td>{{ f.label }}</td>
                        <td>{{ f.value }}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Note</td>
                        <td>{{ transaction.note }}</td>
                        <td>
                            <v-btn color="primary" @click="showEditNoteDialog = true">
                                Edit
                            </v-btn>
                        </td>
                    </tr>
                    <tr>
                        <td>Categorization</td>
                        <td>
                            {{ transactionCategorization }}
                            <IconWithTooltip 
                                v-if="categorizationTooltip" 
                                :tooltip="categorizationTooltip"
                                icon="mdi-dots-horizontal"
                                color="grey"
                                location="bottom"
                            />
                        </td>
                        <td>
                            <v-btn color="primary" @click="showEditCategorizationDialog = true">
                                Edit
                            </v-btn>
                        </td>
                    </tr>
                </tbody>
            </v-table>            
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" @click="emit('close')">Close</v-btn>            
        </v-card-actions>
    </v-card>

    <!-- Edit note dialog -->
    <v-dialog v-model="showEditNoteDialog">
        <EditText
            :text="transaction.note"
            label="Note"
            title="Edit Note"
            @close="showEditNoteDialog = false"
            @save="saveNote"
        />
    </v-dialog>


    <!-- Edit categorization dialog -->
    <v-dialog v-model="showEditCategorizationDialog">
        <EditTransactionCategorization
            :transaction="transaction"
            :categories="categories"
            @close="showEditCategorizationDialog = false"
            @save="save"
        />
    </v-dialog>
</template>