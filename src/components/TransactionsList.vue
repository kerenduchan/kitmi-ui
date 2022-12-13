<script setup>
import { onMounted } from 'vue';
import Transaction from '../components/Transaction.vue'

// props 
const props = defineProps({
  transactions: Object,
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
    <h2>Transactions</h2>

    <v-container>
        <v-row>
            <v-col>Date</v-col>
            <v-col>Amount</v-col>
            <v-col>Payee</v-col>
            <v-col>Account</v-col>
            <v-col>Category</v-col>
            <v-col>Subcategory</v-col>
        </v-row>        
        <v-row v-for="t of props.transactions" :key="t.id">
            <Transaction 
                :transaction="t" 
                :incomeCategories="incomeCategories"
                :expenseCategories="expenseCategories" 
                @change="onChange" 
            />
        </v-row>

    </v-container>
</template>