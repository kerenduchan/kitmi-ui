<script setup>

// props 
const props = defineProps({
  text: String
})

</script>

<template>
    <div class="error" v-if="props.text">Error: {{ props.text }}</div>
</template>