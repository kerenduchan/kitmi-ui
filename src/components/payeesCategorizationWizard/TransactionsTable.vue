<script setup>
import { ref, computed } from 'vue'
import TypeIcon from '@/components/TypeIcon.vue'
import { formatNumber } from '@/composables/utils'

// props 
const props = defineProps({
    transactions: Object
})

const headers = ref([
    'Date', 
    'Amount', 
])

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
            >
                <td>{{ t.formattedDate }}</td>
                <td class="text-right">{{ t.formattedAmount }}</td>
            </tr>
        </tbody>
        <tfoot>
            <tr class="bg-primary">
                <td>Total</td>
                <td class="text-right">{{ sum }}</td>
            </tr>
        </tfoot>
    </table>

</template>

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