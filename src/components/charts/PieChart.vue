<script setup>
import { ref } from 'vue'

const props = defineProps({
    labels: Object,
    series: Object
})

const options = ref({
    labels: props.labels,
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
      <apexchart width="50%" type="donut" :options="options" :series="series"></apexchart>
    </div>
  </template>