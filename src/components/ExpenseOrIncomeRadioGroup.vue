<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    isExpense: Boolean
})

const emit = defineEmits([
    'change'
])

// v-model for the radio group
const isExpense = ref(props.isExpense)

watch(isExpense, () => {
    emit('change', isExpense.value)
})

</script>

<template>
    <v-radio-group label="Type" v-model="isExpense">
        <v-radio :value="true" label="Expense"></v-radio>
        <v-radio :value="false" label="Income"></v-radio>
    </v-radio-group>
</template>