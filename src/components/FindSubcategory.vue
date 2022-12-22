<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    categories: Object
})

const emit = defineEmits([
    'find',
    'close'
])

const subcategories = computed(() => {
    let res = []
    props.categories.forEach(c => res = res.concat(c.subcategories) )
    return res
})

const subcategoryId = ref(null)

function find() {
    emit('find', subcategoryId.value)
}

</script>

<template>
    <v-card>
        <v-card-title>Find Subcategory</v-card-title>
            <v-card-text>
                <!-- Subcategory autocomplete -->
                <v-autocomplete 
                    label="Subcategory" 
                    :items="subcategories" 
                    item-title="name" 
                    item-value="id" 
                    v-model="subcategoryId" 
                />
            </v-card-text>

            <v-card-actions>
                <v-btn color="primary" :disabled="subcategoryId === null" @click="find">Find</v-btn>
                <v-btn color="primary" @click="emit('close')">Close</v-btn>
            </v-card-actions>
        </v-card>
</template>