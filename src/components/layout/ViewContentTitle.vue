<script setup>
const props = defineProps({
    text: String
})
</script>

<template>
        <div id="view-content-title" class="text-h5 pa-5">
            {{ text }}
        </div>
</template>