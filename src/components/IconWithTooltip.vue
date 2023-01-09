<script setup>

// props
const props = defineProps({
    tooltip: String,
    color: String,
    icon: String,
    location: String
})

</script>

<template>
    <v-tooltip :text="tooltip" :location="location">
        <template v-slot:activator="{ props }">
            <v-icon v-bind="props" :color="color">{{ icon }}</v-icon>
        </template>
    </v-tooltip>
</template>