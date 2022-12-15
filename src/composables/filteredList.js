import { ref, computed, watch } from 'vue'

// Reusable code for a list that can be filtered and where also one row can be selected at a time.
// When the selected row is filtered out, the selected item changes to null.
// When the selected row is filtered back in, the selected item is reselected.
// Used in TransactionsList and PayeesList.
class FilteredList {

    constructor(filter, emit) {

        // the function that filters the list
        this.filter = ref(filter)

        // the emitter
        this.emit = emit

        // the filtered list
        this.filteredItems = computed(() => {
            return this.filter.value()
        })

        // the selected item
        this.selectedItem = ref(null)

        // the selected item, after filtering (may be filtered out or back in)
        this.filteredSelectedItem = computed(() => {
            if (this.selectedItem.value === null) {
                return null
            }
            const found = this.filteredItems.value.find(item => item.id === this.selectedItem.value.id)
            return found ? this.selectedItem.value : null
        })

        // filteredSelectedItem changes either as a result of selectItem(...)
        // or a change in the filtering criteria
        watch(this.filteredSelectedItem, () => {
            emit('selectedItemChanged', this.filteredSelectedItem.value)
        })

    }

    // get the class for a selected row in the table
    getClassForRow(item) {
        return this.selectedItem.value?.id === item.id ? 'selected-row' : ''
    }
    
    // handle click on a row in the table (select the item)
    selectItem(item) {
        this.selectedItem.value = item
    }
}

export default FilteredList
