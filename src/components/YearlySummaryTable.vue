<script setup>
import { ref } from 'vue'

// props 
const props = defineProps({
    summary: Object
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

    <v-table density="compact" height="550px" fixed-header>
        <thead>
            <tr>
                <th v-for="header in headers" class="text-left">
                    {{ header }}
                </th>
            </tr>
        </thead>
        <tbody>
        </tbody>
        <tfoot>
        </tfoot>
    </v-table>

</template>