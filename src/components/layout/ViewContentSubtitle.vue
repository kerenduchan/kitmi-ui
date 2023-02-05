<script setup>
const props = defineProps({
    text: String
})

const emit = defineEmits([
    'click'
])

</script>

<template>
        <div id="view-content-subtitle" class="ps-5 text-smaller text-link" @click="emit('click')">
            {{ text }}
        </div>
</template>