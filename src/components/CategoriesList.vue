<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import CategoryOrSubcategoryRow from './CategoryOrSubcategoryRow.vue';
import Subcategory from '@/composables/model/Subcategory'

// props 
const props = defineProps({
    categories: Object,
    forceSelectedItem: Object
})

// emits
const emit = defineEmits([
    'selectedItemChanged'
])

// either a selected category or a selected subcategory
const selectedItem = ref(null)

watchEffect(() => {
    if(props.forceSelectedItem) {
        if(!selectedItem.value || 
        (selectedItem.value && props.forceSelectedItem.id != selectItem.id)) {
            // the parent component forced an item to be selected.
            // this happens when a new category is created.
            selectedItem.value = props.forceSelectedItem
        }
    }
})

function selectItem(item) {
    selectedItem.value = item
}

function isSelectedItem(item) {
    if(!selectedItem.value) {
        return false
    }
    return generateKey(selectedItem.value) == generateKey(item)
}

watch(selectedItem, () => {
    emit('selectedItemChanged', selectedItem.value)
})

const tableRows = computed(() => {
    let res = []
    props.categories.forEach(c => {
        res.push(c)
        c.subcategories.forEach(s => {
            res.push(s)
        })
    })
    return res
})

watchEffect(() => {
    // deselect the selected item if it is no longer in the list
    if(!selectedItem.value) {
        return
    }
    const selectedItemKey = generateKey(selectedItem.value)
    if(!tableRows.value.find(row => generateKey(row) === selectedItemKey)) {
        console.log('selected item is no longer in the list')
        selectedItem.value = null
    }
})


function generateKey(item) {
    return (item instanceof Subcategory ? 's' : 'c') + item.id
}

</script>

<template>
    <v-table density="compact">
        <tbody>
            <CategoryOrSubcategoryRow 
                v-for="item in tableRows" 
                :item="item" 
                :isSelected="isSelectedItem(item)"
                :key="generateKey(item)" 
                @click="selectItem(item)"/>
        </tbody>
    </v-table>
</template>

<style>
.category-type-icon {
    padding-right: 10px;
}

</style>