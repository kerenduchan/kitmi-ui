<script setup>
import { ref, computed } from 'vue'

// props 
const props = defineProps({
    item: Object,
    categories: Object,
    hasNext: Boolean,
    hasPrev: Boolean
})

// emits
const emit = defineEmits([
    'prev',
    'next',
    'close'
])

const selectedCategoryIdx = ref(null)

const selectedCategory = computed(() => {
    return selectedCategoryIdx.value !== null ? props.categories[selectedCategoryIdx.value] : null
})

const selectedSubcategoryIdx = ref(null)

function next() {
    emit('next')
}

function prev() {
    emit('prev')
}

function close() {
    emit('close')
}

</script>

<template>
    <v-card>
        <v-card-title>{{ item.name }}</v-card-title>
        <v-card-text>
            Category:
            <v-item-group v-model="selectedCategoryIdx">
                <v-container>
                    <v-row>
                        <v-col cols="4" v-for="c in categories" :key="c.id">
                            <v-item v-slot="{ isSelected, toggle }">
                                <v-card :color="isSelected ? 'primary' : ''" class="d-flex align-center"
                                    @click="toggle">
                                    <v-card-title>{{ c.name }}</v-card-title>
                                </v-card>
                            </v-item>
                        </v-col>
                    </v-row>
                </v-container>
            </v-item-group>

            <v-divider />

            <div v-if="selectedCategory !== null">
                Subcategory:
                <v-item-group v-model="selectedSubcategoryIdx">
                    <v-container>
                        <v-row>
                            <v-col cols="4" v-for="s in selectedCategory.subcategories" :key="s.id">
                                <v-item v-slot="{ isSelected, toggle }">
                                    <v-card :color="isSelected ? 'primary' : ''" class="d-flex align-center"
                                        @click="toggle">
                                        <v-card-title>{{ s.name }}</v-card-title>
                                    </v-card>
                                </v-item>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-item-group>
            </div>
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" :disabled="!hasPrev" @click="prev">Previous</v-btn>
            <v-btn color="primary" :disabled="!hasNext" @click="next">Next</v-btn>
            <v-btn color="primary" @click="close">Close</v-btn>
        </v-card-actions>
    </v-card>

</template>