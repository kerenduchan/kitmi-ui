<script setup>
import { ref } from 'vue'

const props = defineProps({
    xaxis: Object,
    series: Object,
    xaxisFormatterFunc: Function,
    yaxisFormatterFunc: Function
})


const options = ref({
    chart: {
        id: 'stacked-chart',
        stacked: true
    },
    xaxis: {
        categories: props.xaxis,
        labels: {
            formatter: props.xaxisFormatterFunc
        }
    },
    yaxis: {
        labels: {
            formatter: props.yaxisFormatterFunc
        },
    },
    dataLabels: {
        enabled: true,
        enabledOnSeries: undefined,
        formatter: function (val, opts) {
            return props.yaxisFormatterFunc(val)
        },
    },
    colors: [
        '#005f73',
        '#001219',
        '#0a9396',
        '#94d2bd',
        '#ee9b00',
        '#ca6702',
        '#ae2012',
        '#9b2226',
        '#AE9E70',
        '#1F5D76',
        '#bb3e03',
    ]
})

</script>

<template>
    <div>
        <apexchart height="500" type="bar" :options="options" :series="props.series"></apexchart>
    </div>
</template>