<script setup>
import TypeExpenseOrIncomeIcon from '@/components/TypeExpenseOrIncomeIcon.vue'
import Subcategory from '@/composables/model/Subcategory'

const props = defineProps({
    item: Object,
    isSelected: Boolean
})

const emit = defineEmits(['click'])

function handleClick(item) {
    emit('click', item)
}

// get the class for a selected row in the table
function getClassForRow() {
    return props.isSelected ? 'selected-row' : ''
}

</script>

<template>
    <tr :class="getClassForRow()" @click="handleClick">
        <td v-if="(item instanceof Subcategory)">
            <span class="category-type-icon">
                <v-icon>empty</v-icon>
            </span>
            <span class="category-type-icon">
                <v-icon>empty</v-icon>
            </span>
            {{ item.name }}
        </td>
        <td v-else>
            <span class="category-type-icon">
                <TypeExpenseOrIncomeIcon :type="item.type" />
            </span>
            category: {{ item.name }}
        </td>
    </tr>

</template>

<style>
    .spacer {
        width: "20px";
        background-color: lightyellow;

    }

</style>