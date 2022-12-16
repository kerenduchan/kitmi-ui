import { ref } from 'vue'

function dialog(selectedItem) {
    const show = ref(false)
    const item = ref(null)
    
    function open() {
        // "freeze" the item for the dialog so it doesn't get filtered out
        // in case the item went from being uncategorized to categorized
        // and "Show Only Uncategorized" is checked
        item.value = selectedItem.value
        show.value = true
    }
    
    function close() {
        show.value = false
    }

    return {
        show,
        item,
        open,
        close
    }
}
export default dialog