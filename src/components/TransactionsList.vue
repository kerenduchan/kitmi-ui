<script setup>
import { ref } from 'vue'

// props 
const props = defineProps({
    transactions: Object
})

const headers = ref(['Date', 'Amount', 'Payee', 'Type', 'Category', 'Subcategory'])

</script>

<template>
    <h2>Transactions</h2>

    <v-table>
        <thead>
            <tr>
                <th v-for="header in headers" class="text-left">
                    {{ header }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="t in props.transactions" :key="t.id">
                <td>{{ t.date }}</td>
                <td>{{ t.amount }}</td>
                <td>{{ t.payeeName }}</td>
                <td>{{ t.type }}</td>
                <td>{{ t.categoryName }}</td>
                <td>{{ t.subcategoryName }}</td>
            </tr>
        </tbody>
    </v-table>

</template>