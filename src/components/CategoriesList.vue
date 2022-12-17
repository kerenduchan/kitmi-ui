<script setup>
import { ref } from 'vue'

// props 
const props = defineProps({
    categories: Object
})

// emits
const emit = defineEmits([
    'selectedItemChanged'
])

function handleCategoryClicked(category) {
    emit('selectedItemChanged', category)
}

</script>

<template>
    <h2>Categories</h2>

    <v-expansion-panels>
        <v-expansion-panel v-for="c in props.categories" :key="c.id">
            <v-expansion-panel-title @click="handleCategoryClicked(c)"> {{ c.name }} </v-expansion-panel-title>
            <v-expansion-panel-text>
                <v-list>
                    <v-list-item v-for="s in c.subcategories" :key="s.id" :title="s.name" />
                </v-list>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>