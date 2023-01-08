<script setup>
// props 
const props = defineProps({
    title: String,
    values: Object,
    total: String
})

</script>

<template>
    <tr>
        <td class="row-title-cell summary-table-cell">{{ title }}</td>
        <td v-for="v in values" class="number-cell summary-table-cell">{{ v }}</td>
        <td class="sum-cell summary-table-cell">{{  total}}</td>
    </tr>
</template>