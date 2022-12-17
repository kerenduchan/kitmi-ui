<script setup>
import { ref, computed } from 'vue'

// props 
const props = defineProps({
    item: Object,
    categories: Object
})

const emit = defineEmits([
    'close',
    'save'
])

const name = ref(props.item.name)
const isExpense = ref(props.item.isExpense)

const isNameAlreadyExists = computed(() => {
    return (name != props.item.name && 
        props.categories.find(c => c.name == name.value) !== undefined)
})

const isSaveDisabled = computed(() => {
    return name.value.length === 0 || isNameAlreadyExists.value === true
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
        <v-card-title>Edit Category '{{ item.name }}'</v-card-title>
        <v-card-text>
            <v-form>
                <!-- Name -->
                <v-text-field 
                    label="Name" 
                    v-model="name" 
                    :rules="[ 
                        n => n.length > 0 || 'Name must not be empty',
                        n => !isNameAlreadyExists || 'Name already used'
                        ]" />

                    <!-- Type -->
                <v-radio-group label="Type" v-model="isExpense">
                    <v-radio :value="true" label="Expense"></v-radio>
                    <v-radio :value="false" label="Income"></v-radio>
                </v-radio-group>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" :disabled="isSaveDisabled" @click="save">Save</v-btn>
            <v-btn color="primary" @click="close">Close</v-btn>
            
        </v-card-actions>
    </v-card>
</template>