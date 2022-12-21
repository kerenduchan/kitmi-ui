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
const selectedSubcategoryId = ref(null)

// get the class for a selected row in the table
function getClassForRow(subcategory) {
    if(!selectedSubcategoryId.value) {
        return ''
    }
    return selectedSubcategoryId.value === subcategory.id ? 'selected-row' : ''
}

// handle click on a row in the table (select/deselect the subcategory)
function toggleSelect(subcategory) {
    if(selectedSubcategoryId.value === subcategory.id) {
        // deselect
        selectedSubcategoryId.value = null
    } else {
        selectedSubcategoryId.value = subcategory.id
    }
    emit('select', selectedSubcategoryId.value)
}

</script>

<template>
    <v-table density="compact">
        <tbody>
            <tr v-for="s in subcategories" 
                :key="s.id"
                :class="getClassForRow(s)" 
                @click="toggleSelect(s)"
            >
                <td>{{ s.name }}</td>
            </tr>
        </tbody>
    </v-table>
</template>