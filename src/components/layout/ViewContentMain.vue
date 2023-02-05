<script setup>
import { computed } from 'vue'

const props = defineProps({
    noscroll: Boolean
})

const class_ = computed(() => {
    return 'flex-grow-1 px-5 pb-5 d-flex flex-column overflow-y-' +
        (props.noscroll ? 'hidden' : 'auto')
})

</script>

<template>
    <div id="view-content-main" :class="class_">
        <slot />
    </div>
</template>