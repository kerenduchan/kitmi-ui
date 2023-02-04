<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    items: Object
})

const emit = defineEmits([
    'selected'
])

const selectedIdx = ref(null)

watch(selectedIdx, () => {
    emit('selected', selectedIdx.value)
})

</script>

<template>
    <div class="overflow-y-auto d-flex flex-wrap justify-center">
        <div v-for="item, idx in items" :key="idx" @click="selectedIdx = idx"
            class="d-flex ma-3 bg-secondary py-2 justify-center align-center text-center w-25 rounded">
            {{ item.name }}
        </div>
    </div>
</template>