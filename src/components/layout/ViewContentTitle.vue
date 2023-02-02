<script setup>
const props = defineProps({
    text: String
})
</script>

<template>
        <div class="text-h6 pb-3">
            {{ text }}
        </div>
</template>