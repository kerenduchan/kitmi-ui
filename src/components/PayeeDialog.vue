<script setup>
import { ref } from 'vue'

// props 
const props = defineProps({
    payee: Object
})

const emit = defineEmits(['close'])

</script>

<template>
      <v-card>
        <v-card-text>
          {{ props.payee.name }}
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="emit('close')">Close Dialog</v-btn>
        </v-card-actions>
      </v-card>
</template>