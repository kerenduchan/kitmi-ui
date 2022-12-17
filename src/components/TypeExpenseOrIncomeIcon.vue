<script setup>
import { computed } from 'vue'

const props = defineProps({
    isExpense: Boolean
})

const icon = computed(() => {
    return props.isExpense ? 'mdi-minus' : 'mdi-plus'
})

const color = computed(() => {
    return props.isExpense ? 'red' : 'green'
})

</script>

<template>
    <v-icon :color="color">{{ icon }}</v-icon>
</template>