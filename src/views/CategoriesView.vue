<script setup>
import TopBar from '@/components/TopBar.vue'
import CategoriesList from '@/components/CategoriesList.vue'
import getCategories from '@/composables/queries/getCategories'

const { categories, isReady, refetch } = getCategories()

</script>



<template>
    <TopBar>
    </TopBar>

    <div v-if="!isReady">Loading...</div>
    <div v-else>
        <CategoriesList :categories="categories" />
    </div>
</template>
