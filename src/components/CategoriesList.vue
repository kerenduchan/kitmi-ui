<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import CategoryOrSubcategoryRow from './CategoryOrSubcategoryRow.vue'

// props 
const props = defineProps({
    categories: Object,
    forceSelectedItemKey: String
})

// emits
const emit = defineEmits([
    'select'
])

// The items (categories and subcategories) in the order they appear 
// in the table
const items = computed(() => {
    let res = []
    props.categories.forEach(c => {
        res.push(c)
        c.subcategories.forEach(s => {
            res.push(s)
        })
    })
    return res
})

// The key of the selected item
const selectedItemKey = ref(null)

// Either a selected category or a selected subcategory
// Compute it from the list because an item might become stale on changes
const selectedItem = computed(() => {
    const found = items.value.find(item => item.key === selectedItemKey.value)
    return found ? found : null
})

watchEffect(() => {
    if(props.forceSelectedItemKey) {
        if(!selectedItemKey.value || 
        (selectedItemKey.value != props.forceSelectedItemKey)) {
            // the parent component forced an item to be selected.
            // this happens when a new category is created.
            selectedItemKey.value = props.forceSelectedItemKey
        }
    }
})

function selectItem(item) {
    selectedItemKey.value = item.key
}

function isSelectedItem(item) {
    if(!selectedItem.value) {
        return false
    }
    return selectedItemKey.value == item.key
}

watch(selectedItem, () => {
    emit('select', selectedItem.value)
})

</script>

<template>
    <v-table density="compact">
        <tbody>
            <CategoryOrSubcategoryRow 
                v-for="item in items" 
                :item="item" 
                :isSelected="isSelectedItem(item)"
                :key="item.key" 
                @click="selectItem(item)"/>
        </tbody>
    </v-table>
</template>

<style>
.category-type-icon {
    padding-right: 10px;
}

</style>