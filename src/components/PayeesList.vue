<script setup>
import Payee from '../components/Payee.vue'

// props 
const props = defineProps({
  payees: Object,
  incomeCategories: Object,
  expenseCategories: Object
})

// events 
const emit = defineEmits([
  'change'
])

function onChange() {
  // notify the parent component that something changed
  emit('change')
}

</script>

<template>
    <h2>Payees</h2>

    <ul>
        <div v-for="p of props.payees" :key="p.id">
            <Payee 
                :payee="p" 
                :incomeCategories="incomeCategories"
                :expenseCategories="expenseCategories" 
                @change="onChange" 
            />
        </div>
    </ul>
</template>