<script setup>

// props 
const props = defineProps({
    title: String
})

const emit = defineEmits([
    'cancel',
    'yes'
])

</script>

<template>
    <v-card>
        <v-card-title>{{ title }}</v-card-title>
        <v-card-text>
            Are you sure?
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" @click="emit('yes')">Yes</v-btn>
            <v-btn color="primary" @click="emit('cancel')">Cancel</v-btn>
        </v-card-actions>
    </v-card>
</template>