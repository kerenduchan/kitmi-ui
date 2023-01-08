<script setup>
import { ref } from 'vue'
import { getChartColors } from '@/composables/utils'


const props = defineProps({
    xaxis: Object,
    series: Object,
    yaxisFormatterFunc: Function
})


const options = ref({
    chart: {
        id: 'stacked-chart',
        stacked: true
    },
    xaxis: {
        categories: props.xaxis,
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
    colors: getChartColors()
})

</script>

<template>
    <div>
        <apexchart height="500" type="bar" :options="options" :series="props.series"></apexchart>
    </div>
</template>