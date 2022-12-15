<script setup>
import { ref } from 'vue'

// props 
const props = defineProps({
    rows: Object
})

const headers = ref([
    'Category', 
    'Subcategory', 
    'January', 
    'February', 
    'March', 
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
    'Total',
])

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
            <tr v-for="r in props.rows">
                <td>{{ r.subcategory.category.name }}</td>
                <td>{{ r.subcategory.name }}</td>
                <td v-for="sum in r.monthlySums" class="text-right">{{ sum }}</td>
                <td class="text-right">{{ r.formattedTotalSum }}</td>
            </tr>
        </tbody>
        <tfoot>
        </tfoot>
    </v-table>

</template>