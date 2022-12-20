<script setup>
import { ref, computed, onMounted } from 'vue'
import CategorizationWizardOnePayee from '@/components/CategorizationWizardOnePayee.vue'

// props 
const props = defineProps({
    items: Object,
    categories: Object
})

// emits
const emit = defineEmits([
    'close'
])

const currentItemIdx = ref(0)

const currentItem = computed(() => {
    return props.items[currentItemIdx.value]
})

const hasNext = computed(() => {
    return currentItemIdx.value < props.items.length - 1
})

const hasPrev = computed(() => {
    return currentItemIdx.value > 0
})

const filteredCategories = computed(() => {
    return props.categories.filter(item => item.hasSubcategories)
})

function next() {
    currentItemIdx.value++
}

function prev() {
    currentItemIdx.value--
}

function close() {
    emit('close')
}

</script>

<template>
    <v-card>
        <v-card-title>Categorization Wizard</v-card-title>
        <v-card-text>
            <CategorizationWizardOnePayee 
                :item="currentItem" 
                :categories="filteredCategories" 
                :hasNext="hasNext"
                :hasPrev="hasPrev"
                @next="next"
                @prev="prev"
                @close="close"
            />
        </v-card-text>
        <v-card-actions>

        </v-card-actions>
    </v-card>
</template>