<script setup>
// props 
const props = defineProps({
    values: Object,
})

</script>

<template>
    <tr>
        <th v-for="v in values" class="bg-primary text-center">
            {{ v }}
        </th>
    </tr>
</template>

<style scoped>
    th {
        height: 36px !important;
    }
</style>