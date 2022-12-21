<script setup>
import { ref } from 'vue'
// props
const props = defineProps({
    subcategories: Object
})

// emits
const emit = defineEmits([
    'select'
])

// the selected subcategory
const selectedSubcategory = ref(null)

// get the class for a selected row in the table
function getClassForRow(subcategory) {
    if(!selectedSubcategory.value) {
        return ''
    }
    return selectedSubcategory.value.id === subcategory.id ? 'selected-row' : ''
}

// handle click on a row in the table (select the subcategory)
function select(subcategory) {
    selectedSubcategory.value = subcategory
    emit('select', selectedSubcategory.value)
}

</script>

<template>
    <v-table density="compact">
        <tbody>
            <tr v-for="s in subcategories" 
                :key="s.id"
                :class="getClassForRow(s)" 
                @click="select(s)"
            >
                <td>{{ s.name }}</td>
            </tr>
        </tbody>
    </v-table>
</template>