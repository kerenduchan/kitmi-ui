<script setup>
import { ref } from 'vue'

// props 
const props = defineProps({
    categories: Object
})

const headers = ref(['Type', 'Name'])

</script>

<template>
    <h2>Categories</h2>

    <v-expansion-panels multiple>
        <v-expansion-panel v-for="c in props.categories" :key="c.id">
            <v-expansion-panel-title> {{ c.name }} </v-expansion-panel-title>
            <v-expansion-panel-text>
                <v-list>
                    <v-list-item v-for="s in c.subcategories" :key="s.id" :title="s.name" />
                </v-list>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>