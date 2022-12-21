<script setup>
import { ref } from 'vue'

// props 
const props = defineProps({
    accounts: Object
})

// emits
const emit = defineEmits([
    'select'
])

const headers = ref([
    'Name',
    'Source',
])

</script>

<template>

    <v-table density="compact" fixed-header>
        <thead>
            <tr>
                <th v-for="header in headers" class="text-left">
                    {{ header }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="a in accounts" 
                :key="a.id"
            >
                <td>{{ a.name }}</td>
                <td>{{ a.source }}</td>
            </tr>
        </tbody>
    </v-table>

</template>