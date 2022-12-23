import { ref } from 'vue'

function snackbar() {
    const showSnackbar = ref(false)
    const snackbarText = ref('')
    
    function displaySnackbar(text) {
        snackbarText.value = text
        showSnackbar.value = true
    }

    return { showSnackbar, snackbarText, displaySnackbar }
}

export default snackbar