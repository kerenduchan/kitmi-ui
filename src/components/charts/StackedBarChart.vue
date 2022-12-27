<script setup>
import { ref } from 'vue'

const props = defineProps({
    xaxis: Object,
    series: Object
})

const options = ref({
    chart: {
        id: 'stacked-chart',
        stacked: true
    },
    xaxis: {
        categories: props.xaxis
    }
})

</script>

<template>
    <div>
        <apexchart width="900" height="500" type="bar" :options="options" :series="props.series"></apexchart>
    </div>
</template>