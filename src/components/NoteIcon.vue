<script setup>
import IconWithTooltip from '@/components/IconWithTooltip.vue';

// props
const props = defineProps({
    note: String
})

</script>

<template>
    <IconWithTooltip :tooltip="note" color="grey" icon="mdi-dots-horizontal"/>
</template>