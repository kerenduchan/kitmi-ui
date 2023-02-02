<script setup>
const props = defineProps({
    text: String
})
</script>

<template>
        <div class="text-h5 pb-3">
            {{ text }}
        </div>
</template>