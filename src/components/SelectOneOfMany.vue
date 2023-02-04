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
    <div class="overflow-y-auto d-flex flex-wrap">
        <v-chip v-for="item, idx in items" :key="idx" @click="selectedIdx = idx" class="ma-3">
            {{ item.name }}
        </v-chip>
    </div>
</template>