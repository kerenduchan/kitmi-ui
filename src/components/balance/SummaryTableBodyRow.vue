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
        <td class="bg-primary">{{ title }}</td>
        <td v-for="v in values" class="bg-surface text-right">{{ v }}</td>
        <td class="bg-secondary text-right">{{ total }}</td>
    </tr>
</template>

<style scoped>
    td {
        height: 36px !important;
    }
</style>