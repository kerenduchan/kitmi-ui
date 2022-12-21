<script setup>

// props 
const props = defineProps({
    accounts: Object
})

// emits
const emit = defineEmits([
    'close',
    'created'
])

</script>

<template>
    <v-card>
        <v-card-title>Create Account</v-card-title>
        <v-card-text>
        </v-card-text>
    </v-card>
</template>