<script setup>
// props 
const props = defineProps({
    account: Object
})

// emits
const emit = defineEmits([
    'close',
    'change'
])

</script>

<template>
    <v-card>
        <v-card-title>Edit Account '{{ account.name }}'</v-card-title>
        <v-card-text>
        </v-card-text>
    </v-card>
</template>