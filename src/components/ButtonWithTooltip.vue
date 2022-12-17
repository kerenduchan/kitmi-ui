<script setup>

const props = defineProps({
    disabled: Boolean,
    tooltip: String,
    icon: String
})

const emit = defineEmits(['click'])
</script>

<template>
    <v-tooltip :text="tooltip" location="bottom">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" :icon="icon" :disabled="disabled" @click="emit('click')">
            </v-btn>
        </template>
    </v-tooltip>

</template>