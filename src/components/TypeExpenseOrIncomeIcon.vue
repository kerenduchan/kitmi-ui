<script setup>
import { computed } from 'vue'

const props = defineProps({
    type: String
})

const icon = computed(() => {
    switch (props.type) {
        case 'Expense':
            return 'mdi-minus-circle-outline'
            break
        case 'Income':
            return 'mdi-plus-circle-outline'
            break
        default:
            return 'mdi-help-circle-outline'
            break
}
})

</script>

<template>
    <v-icon size="small">{{ icon }}</v-icon>
</template>