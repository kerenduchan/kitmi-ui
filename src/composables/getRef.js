
import { ref } from 'vue'

function getRef() {

    // The selected subcategory ID
    const subcategoryId = ref(undefined)

    return { 
        subcategoryId
    }
}

export default getRef