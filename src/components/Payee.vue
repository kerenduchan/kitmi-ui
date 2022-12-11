<script setup>
import { ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

// This component represents one payee in the Payees view

// props 
const props = defineProps({
  payee: Object
})

// events 
const emit = defineEmits([
  'change'
])

</script>

<template>
    payee: {{ props.payee.name }}
</template>

