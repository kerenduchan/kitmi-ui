<script setup>

// props
const props = defineProps({
    subcategories: Object,
    selectedSubcategoryId: String
})

// emits
const emit = defineEmits([
    'select'
])

// get the class for a selected row in the table
function getClassForRow(subcategory) {
    if(!props.selectedSubcategoryId === undefined) {
        return ''
    }
    return props.selectedSubcategoryId === subcategory.id ? 'selected-row' : ''
}

function selectSubcategory(subcategoryId) {
    emit('select', subcategoryId)
}

// handle click on a row in the table (select/deselect the subcategory)
function toggleSelect(subcategoryId) {
    selectSubcategory((props.selectedSubcategoryId === subcategoryId) ? null : subcategoryId)
}

</script>

<template>
    <v-table density="compact">
        <tbody>
            <tr v-for="s in subcategories" 
                :key="s.id"
                :class="getClassForRow(s)" 
                @click="toggleSelect(s.id)"
            >
                <td>{{ s.name }}</td>
            </tr>
        </tbody>
    </v-table>
</template>