<script setup>
import { ref } from 'vue'

const props = defineProps({
    months: Object,
    series: Object
})

const options = ref({
    chart: {
        id: 'stacked-chart',
        stacked: true
    },
    xaxis: {
        categories: props.months
    }
})

</script>

<template>
    <div>
        <apexchart width="900" type="bar" :options="options" :series="props.series"></apexchart>
    </div>
</template>