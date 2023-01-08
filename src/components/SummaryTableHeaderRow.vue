<script setup>
// props 
const props = defineProps({
    values: Object,
})

</script>

<template>
    <tr>
        <th v-for="v in values" class="thead-cell summary-table-cell">
            {{ v }}
        </th>
    </tr>
</template>