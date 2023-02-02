<script setup>
import TypeIconVue from '@/components/TypeIcon.vue'

import TypeIcon from '@/composables/TypeIcon'

const props = defineProps({
    headers: Object,
    rows: Object,
    selectedRowIdx: Number
})

const emit = defineEmits([
    'select'
])

function getClassForRow(idx) {
    return props.selectedRowIdx === idx ? 'bg-secondary' : ''
}

// handle click on a row in the table
function handleRowClicked(idx) {
    // select or deselect
    emit('select', (idx === props.selectedRowIdx) ? null : idx)
}

</script>

<template>
    <table class="w-100">
        <thead>
            <tr>
                <th v-for="header in headers" class="bg-primary">{{ header }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="row, idx in rows" class="bg-surface" :class="getClassForRow(idx)"
                @click="handleRowClicked(idx)">
                <td v-for="cell in row">
                    <template v-if="(cell instanceof TypeIcon)">
                        <TypeIconVue :type="cell.type" :isExcluded="cell.isExcluded" />
                    </template>
                    <template v-else>
                        {{ cell }}
                    </template>
                </td>
            </tr>
        </tbody>
    </table>


</template>

<style scoped>
th {
    z-index: 1;
    position: sticky;
    top: 0;
}

td {
    border-bottom: 1px solid var(--table-row-divider-color);
}
</style>