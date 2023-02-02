<script setup>
import { ref, computed } from 'vue'
import TypeIcon from '@/components/TypeIcon.vue'
import NoteIcon from '@/components/NoteIcon.vue'
import { formatNumber } from '@/composables/utils'

// props 
const props = defineProps({
    selectedTransactionId: String,
    transactions: Object
})

// emits
const emit = defineEmits([
    'select'
])

const headers = ref([
    '',
    'Date', 
    'Amount', 
    'Payee', 
    'Category', 
    'Subcategory',
    'Note'
])

// get the class for a selected row in the table
function getClassForRow(transaction) {
    return props.selectedTransactionId === transaction.id ? 'bg-secondary' : 'bg-surface'
}

// handle click on a row in the table (select the transaction)
function handleRowClicked(transaction) {
    // select or deselect
    emit('select', (transaction.id === props.selectedTransactionId) ? null : transaction.id)
}

// the computed sum of the rows
const sum = computed(() => {
    const tmp = props.transactions.reduce((partialSum, t) => partialSum + t.amount, 0)
    return formatNumber(tmp)
})

</script>

<template>

    <table class="w-100">
        <thead>
            <tr>
                <th v-for="header in headers" class="bg-primary">
                    {{ header }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="t in transactions" 
                :key="t.id"
                :class="getClassForRow(t)" 
                @click="handleRowClicked(t)"
            >
                <td>
                    <TypeIcon :type="t.type"  :isExcluded="t.excludeFromReports"/>
                </td>
                <td>
                    {{ t.formattedDate }}
                </td>
                <td class="text-right">
                    {{ t.formattedAmount }}
                </td>
                <td>
                    {{ t.payeeName }}
                    <NoteIcon v-if="t.payee.note.length > 0" :note="t.payee.note" />
                </td>
                <td>{{ t.categoryName }}<span class="red" v-if="t.overrideSubcategory"> *</span></td>
                <td>{{ t.subcategoryName }}<span class="red" v-if="t.overrideSubcategory"> *</span></td>
                <td>
                    {{ t.note }}
                </td>
            </tr>
        </tbody>
    </table>

</template>

<style>
.red {
    color: red;
}
</style>

<style scoped>
th {
    z-index: 1;
    position: sticky;
    top: 0;
}

td {
    border-bottom: 1px solid var(--table-row-divider-color);
}
</style>