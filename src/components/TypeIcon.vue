<script setup>
import { computed } from 'vue'

// type icon for transaction, payee, category

const props = defineProps({
    type: String
})

const iconAndColor = computed(() => {
    let res = {
        icon: '',
        color: ''
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
        case 'Zero':
            res.icon = 'mdi-numeric-0-circle-outline'
            res.color = 'grey'
            break
        case 'Excluded':
            res.icon = 'mdi-close-circle-outline'
            res.color = '#616161'
            break
        case 'Undefined':
            res.icon = 'mdi-help-circle-outline'
            res.color = '#DDDDDD'
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