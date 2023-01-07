<script setup>
import { ref, computed } from 'vue'
import { formatNumber } from '@/composables/utils'

// props 
const props = defineProps({
    buckets: Object,
    groups: Object
})

console.log(props.groups)

const headers = computed(() => {
    return [
        '',
        ...props.buckets,
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
            <tr v-for="g in props.groups">
                <td>{{ g.name }}</td>
                <td v-for="d in g.data " class="text-right">{{ formatNumber(d, 0) }}</td>
                <td class="text-right">{{ formatNumber(g.total, 0) }}</td>
            </tr>
        </tbody>
    </v-table>

</template>