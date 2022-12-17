<script setup>
import { ref } from 'vue'
// props
const props = defineProps({
    items: Object
})

// emits
const emit = defineEmits([
    'selectedItemChanged'
])

// the selected item
const selectedItem = ref(null)

// get the class for a selected row in the table
function getClassForRow(item) {
    if(!selectedItem.value) {
        return ''
    }
    return selectedItem.value?.id === item.id ? 'selected-row' : ''
}

// handle click on a row in the table (select the item)
function selectItem(item) {
    console.log('select item ' + item.name)
    selectedItem.value = item
    emit('selectedItemChanged', selectedItem.value)
}

</script>

<template>
    <v-table density="compact">
        <tbody>
            <tr v-for="s in items" 
                :key="s.id"
                :class="getClassForRow(s)" 
                @click="selectItem(s)"
            >
                <td>{{ s.name }}</td>
            </tr>
        </tbody>
    </v-table>
</template>