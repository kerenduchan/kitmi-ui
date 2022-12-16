
import { ref } from 'vue'

function subcategorySelect() {
    // The selected type (Income/Expense)
    const type = ref(null)

    // The selected category ID
    const categoryId = ref(null)

    // The selected subcategory ID
    const subcategoryId = ref(null)

    return { 
        type,
        categoryId,
        subcategoryId
    }
}

export default subcategorySelect