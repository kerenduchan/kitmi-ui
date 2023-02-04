<script setup>
const props = defineProps({
    category: Object,
    subcategory: Object
})

const emit = defineEmits([
    'categoryClicked',
    'subcategoryClicked'
])

</script>

<template>
    <div class="pt-3">
        Categorization:
        <span v-if="category === null">
            <span class="text-excluded font-italic">Uncategorized</span>
        </span>
        <span v-else>
            <a @click="emit('categoryClicked')" class="text-link font-weight-bold">{{ category.name }}</a>
        </span>
        <span v-if="subcategory !== null">
            >
            <a @click="emit('subcategoryClicked')" class="text-link font-weight-bold">{{ subcategory.name }}</a>
        </span>
    </div>

</template>