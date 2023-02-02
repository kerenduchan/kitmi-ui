<script setup>
const props = defineProps({
    text: String
})
</script>

<template>
        <div class="text-h5 pa-5">
            {{ text }}
        </div>
</template>