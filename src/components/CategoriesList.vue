<script setup>
import { ref, watch } from 'vue'
import TypeExpenseOrIncomeIcon from '@/components/TypeExpenseOrIncomeIcon.vue'

// props 
const props = defineProps({
    categories: Object
})

// emits
const emit = defineEmits([
    'selectedItemChanged'
])

const selectedItem = ref(null)

watch(selectedItem, () => {
    emit('selectedItemChanged', selectedItem.value)
})

</script>

<template>
    <v-expansion-panels v-model="selectedItem">
        <v-expansion-panel v-for="c in props.categories" :key="c.id" :value="c">
            <v-expansion-panel-title>
                <div class="category-type-icon"><TypeExpenseOrIncomeIcon :type="c.type" /></div>
                {{ c.name }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
                <v-list>
                    <v-list-item v-for="s in c.subcategories" :key="s.id" :title="s.name" />
                </v-list>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<style>
.category-type-icon {
    padding-right: 10px;
}

</style>