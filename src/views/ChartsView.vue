<script setup>
import { ref } from 'vue'
import StackedBarChart from '@/components/charts/StackedBarChart.vue'

const months = ref(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])

const series = ref([{
        name: 'Food',
        data: [44, 55, 41, 37, 22, 43, 21, 22, 43, 21, 41, 37]
    },
    {
        name: 'Transportation',
        data: [14, 25, 11, 57, 12, 63, 11, 12, 46, 31, 21, 17]
    }
    ])
</script>

<template>
    <div class="top-bar">
    </div>
    <v-divider />

    <StackedBarChart :months="months" :series="series"/>
</template>
