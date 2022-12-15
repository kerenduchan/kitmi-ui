import { ref, computed, watch, watchEffect } from 'vue'
    
// Reusable code for a list that can be filtered and where also one row can be selected at a time.
// When the selected row is filtered out, the selected item changes to null.
// When the selected row is filtered back in, the selected item is reselected.
// Used in TransactionsList and PayeesList.

// the function that filters the list
const filterFunc = ref(null)

// the emitter
let emit = null

// init the filter function
function initFilteredList(filter, iEmit) {
    filterFunc.value = filter
    emit = iEmit
}

// the filtered list
const filteredList = computed(() => {
    return filterFunc.value()
})

// the selected item
const selectedItem = ref(null)

// the selected item, after filtering (may be filtered out or back in)
const filteredSelectedItem = computed(() => {
    if(selectedItem.value === null) {
        return null
    }
    const found = filteredList.value.find(item => item.id === selectedItem.value.id)
    return found ? selectedItem.value : null
})

// get the class for a selected row in the table
function getClassForRow(item) {
    return selectedItem.value?.id === item.id ? 'selected-row' : ''
}

// handle click on a row in the table (select the item)
function selectItem(item) {
    selectedItem.value = item
}

// filteredSelectedItem changes either as a result of selectItem(...)
// or a change in the filtering criteria
watch(filteredSelectedItem, () => {
    emit('selectedItemChanged', filteredSelectedItem.value)
})

export {
    initFilteredList,
    getClassForRow,
    selectItem,
    filteredList
}
