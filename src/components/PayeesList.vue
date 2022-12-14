<script setup>
import { ref } from 'vue'

// props 
const props = defineProps({
    payees: Object
})

const headers = ref(['Name', 'Type', 'Category', 'Subcategory'])

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
            <tr v-for="p in props.payees" :key="p.id">
                <td>{{ p.name}}</td>
                <td>{{ p.type }}</td>
                <td>{{ p.categoryName }}</td>
                <td>{{ p.subcategoryName }}</td>
            </tr>
        </tbody>
    </v-table>
</template>