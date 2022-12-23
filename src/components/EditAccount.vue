<script setup>
import { ref, computed } from 'vue'

// props 
const props = defineProps({
    account: Object,
    accounts: Object
})

// emits
const emit = defineEmits([
    'close',
    'save'
])

// v-model for the form fields
const name = ref(props.account.name)

const isNameAlreadyExists = computed(() => {
    return (name.value != props.account.name && 
        props.accounts.find(a => a.name == name.value) !== undefined)
})

const isSaveDisabled = computed(() => {
    return name.value.length === 0 || isNameAlreadyExists.value === true
})

function save() {
    const account = { 
        name: name.value,
    }
    emit('save', account)
}

</script>

<template>
    <v-card>
        <v-card-title>Edit Account '{{ account.name }}'</v-card-title>
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
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" :disabled="isSaveDisabled" @click="save">Save</v-btn>
            <v-btn color="primary" @click="emit('close')">Close</v-btn>            
        </v-card-actions>
    </v-card>
</template>