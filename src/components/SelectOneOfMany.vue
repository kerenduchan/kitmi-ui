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
        <v-hover v-for="item, idx in items" :key="idx">
            <template v-slot:default="{ isHovering, props }">
                <div class="d-flex ma-2 py-2 justify-center align-center text-center w-25 rounded"
                :class="isHovering ? 'bg-secondary-1' : 'bg-secondary'"
                    @click="selectedIdx = idx" v-bind="props">
                    <slot :item="item"></slot>             
                </div>
            </template>
        </v-hover>
    </div>
</template>