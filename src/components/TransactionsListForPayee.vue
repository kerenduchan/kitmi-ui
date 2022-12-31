<script setup>
import { ref, computed } from 'vue'
import TypeIcon from '@/components/TypeIcon.vue'
import { formatNumber } from '@/composables/utils'

// props 
const props = defineProps({
    transactions: Object
})

const headers = ref([
    '',
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

    <v-table density="compact" height="300px" fixed-header>
        <thead>
            <tr>
                <th v-for="header in headers" class="text-left">
                    {{ header }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="t in transactions" 
                :key="t.id"
            >
                <td><TypeIcon :type="t.type"  :isExcluded="t.excludeFromReports"/></td>
                <td>{{ t.formattedDate }}</td>
                <td class="text-right">{{ t.formattedAmount }}</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td></td>
                <td>Total</td>
                <td class="text-right">{{ sum }}</td>
            </tr>
        </tfoot>
    </v-table>

</template>