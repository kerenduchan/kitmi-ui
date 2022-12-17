<script setup>
import { ref, computed } from 'vue'

// props 
const props = defineProps({
    categories: Object
})

const emit = defineEmits([
    'close',
    'save'
])

const name = ref('')
const isExpense = ref(false)

const isSaveDisabled = computed(() => {
    return name.value.length === 0
})

function save() {
    console.log('save')
}

function close() {
    emit('close')
}

</script>

<template>
    <v-card>
        <v-card-title>Create Category</v-card-title>
        <v-card-text>
            <v-form>
                <v-text-field label="Name" v-model="name" />
                <v-radio-group label="Type" v-model="isExpense">
                    <v-radio :value="false" label="Expense"></v-radio>
                    <v-radio :value="true" label="Income"></v-radio>
                </v-radio-group>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" :disabled="isSaveDisabled" @click="save">Save</v-btn>
            <v-btn color="primary" @click="close">Close</v-btn>
            
        </v-card-actions>
    </v-card>
</template>