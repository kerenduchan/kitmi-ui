<script setup>
import { ref } from 'vue'
import TopBar from '@/components/TopBar.vue'
import YearlySummaryTable from '@/components/YearlySummaryTable.vue'
import getYearlySummary from '@/composables/queries/getYearlySummary'

const {
    summary,
    isReady,
    refetch
} = getYearlySummary()

</script>

<template>
    <TopBar>
    </TopBar>

    <div v-if="!isReady">Loading...</div>
    <div v-else>
        <YearlySummaryTable 
            :summary="summary" 
        />
    </div>
</template>
