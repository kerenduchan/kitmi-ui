<script setup>
import CategoriesList from '@/components/CategoriesList.vue'
import getCategories from '@/composables/queries/getCategories'

const { categories, isReady, refetch } = getCategories()

</script>

<template>
    <div v-if="!isReady">Loading...</div>
    <div v-else>
        <CategoriesList :categories="categories"/>
    </div>
</template>
