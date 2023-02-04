<script setup>
import TypeIcon from '../TypeIcon.vue'

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
    <div class="pt-3 d-flex gap">
        Categorization:
        <span v-if="!category">
            <span class="text-excluded font-italic">Uncategorized</span>
        </span>
        <span v-else>
            <TypeIcon :type="category.type" :isExcluded="category.excludeFromReports" />
            <a @click="emit('categoryClicked')" class="pl-1 text-link font-weight-bold">{{ category.name }}</a>
        </span>
        <span v-if="category">
            >
        </span>
        <span v-if="subcategory">
            <a @click="emit('subcategoryClicked')" class="text-link font-weight-bold">{{ subcategory.name }}</a>
        </span>
        <span v-if="category && !subcategory">
            <span class="text-excluded font-italic">Uncategorized</span>
        </span>
    </div>

</template>

<style scoped>
.gap {
    gap: 10px;
}
</style>