<script setup>
import { ref, watch, watchEffect } from 'vue';

    const props = defineProps({
        text: String,
        show: Boolean
    })

    const emit = defineEmits([ 
        'close'
    ])

    // v-model for v-snackbar
    const snackbar = ref(false)

    watchEffect(() => {
        snackbar.value = props.show
    })

    watch(snackbar, () => {
        if(!snackbar.value) {
            emit('close')
        }
    })

</script>

<template>
    <v-snackbar v-model="snackbar" timeout="2000" transition="fade-transition">
        {{ text }}
        <template v-slot:actions>
            <v-btn color="blue" variant="text" @close="snackbar = false">
                Close
            </v-btn>
        </template>

    </v-snackbar>

</template>