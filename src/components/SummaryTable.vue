<script setup>
import { ref, computed } from 'vue'
import { formatNumber } from '@/composables/utils'

// props 
const props = defineProps({
    summary: Object,
})

console.log(props.groups)

const headers = computed(() => {
    return [
        '',
        ...props.summary.buckets,
        'Total',
    ]
})

</script>

<template>
    <v-table density="compact">
        <thead>
            <tr>
                <th v-for="header in headers" class="text-left">
                    {{ header }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="g in props.summary.groups">
                <td>{{ g.name }}</td>
                <td v-for="v in g.data " class="text-right">{{ formatNumber(v, 0) }}</td>
                <td class="text-right">{{ formatNumber(g.total, 0) }}</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td>Total</td>
                <td v-for="v in props.summary.totals" class="text-right">{{ formatNumber(v, 0) }}</td>
            </tr>
        </tfoot>
    </v-table>

</template>