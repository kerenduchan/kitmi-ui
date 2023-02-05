<script setup>
const props = defineProps({
    text: String
})
</script>

<template>
        <div id="view-content-subtitle" class="ps-5 text-smaller">
            {{ text }}
        </div>
</template>