<script setup>
import { ref, watchEffect } from 'vue';

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

</script>

<template>
    <v-snackbar v-model="snackbar" timeout="2000" rounded="pill" transition="fade-transition">
        {{ text }}
        <template v-slot:actions>
            <v-btn color="blue" variant="text" @close="emit('close')">
                Close
            </v-btn>
        </template>

    </v-snackbar>

</template>