<script setup>
import { ref } from 'vue'
import { getChartColors } from '@/composables/utils'

const props = defineProps({
    labels: Object,
    series: Object
})

const options = ref({
    labels: props.labels,
    colors: getChartColors()
})

</script>

<template>
    <div>
      <apexchart width="50%" type="donut" :options="options" :series="series"></apexchart>
    </div>
  </template>