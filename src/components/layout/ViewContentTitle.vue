<script setup>
const props = defineProps({
    text: String
})
</script>

<template>
        <div id="view-content-title" class="text-h5 ps-5 pt-3 pb-1">
            {{ text }}
        </div>
</template>