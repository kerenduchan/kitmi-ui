<script setup>
import Payee from '../components/Payee.vue'

// props 
const props = defineProps({
  payees: Object,
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
        <li v-for="p of props.payees" :key="p.id">
            <Payee 
                :payee="p" 
                @change="onChange" 
            />
        </li>
    </ul>
</template>