<script setup>
import { ref, computed, watch } from 'vue'
import CategoryOrSubcategoryRow from './CategoryOrSubcategoryRow.vue';
import Subcategory from '@/composables/model/Subcategory'

// props 
const props = defineProps({
    categories: Object
})

// emits
const emit = defineEmits([
    'selectedItemChanged'
])

// the selected category
const selectedCategory = ref(null)

// either a selected category or a selected subcategory
const selectedItem = ref(null)

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