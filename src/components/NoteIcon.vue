<script setup>

// props
const props = defineProps({
    note: String
})

</script>

<template>
    <v-tooltip :text="note">
        <template v-slot:activator="{ props }">
            <v-icon v-bind="props" color="grey">mdi-dots-horizontal</v-icon>
        </template>
    </v-tooltip>
</template>