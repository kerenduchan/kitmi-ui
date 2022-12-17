<script setup>
import { computed } from 'vue'

const props = defineProps({
    type: String
})

const iconAndColor = computed(() => {
    let res = {
        icon: 'mdi-help-circle-outline',
        color: 'grey'
    }
    switch (props.type) {
        case 'Expense':
            res.icon = 'mdi-minus-circle-outline'
            res.color = '#F08080'
            break
        case 'Income':
        res.icon = 'mdi-plus-circle-outline'
            res.color = '#37A0CC'
            break
        default:
            break
    }
    return res
})

const icon = computed(() => {
    return iconAndColor.value.icon
})

const color = computed(() => {
    return iconAndColor.value.color
})

</script>

<template>
    <v-icon size="small" :color="color">{{ icon }}</v-icon>
</template>