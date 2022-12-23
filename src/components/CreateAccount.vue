<script setup>
import { ref, computed } from 'vue'

// props 
const props = defineProps({
    accounts: Object
})

// emits
const emit = defineEmits([
    'close',
    'save'
])

// v-models for the form fields
const name = ref('')
const source = ref('')
const username = ref('')
const password = ref('')

const isNameAlreadyExists = computed(() => {
    return props.accounts.find(a => a.name == name.value) !== undefined
})

const isSaveDisabled = computed(() => {
    return name.value.length === 0 || isNameAlreadyExists.value === true
})

function save() {
    const account = { 
        name: name.value,
        source: source.value,
        username: username.value,
        password: password.value
    }
    emit('save', account)
}

const sources = ref([
    {
        name: 'max',
        id: 'MAX'
    },
    {
        name: 'leumi',
        id: 'LEUMI'
    }

])
</script>

<template>
    <v-card>
        <v-card-title>Create Account</v-card-title>
        <v-card-text>
            <v-form>
                <!-- Name -->
                <v-text-field label="Name" v-model="name" :rules="[
                    n => n.length > 0 || 'Name must not be empty',
                    n => !isNameAlreadyExists || 'Name already used'
                ]" />

                <!-- Source -->
                <v-select label="Source" :items="sources" item-title="name" item-value="id" v-model="source" />

                <!-- Username -->
                <v-text-field label="Username" v-model="username" :rules="[
                    n => n.length > 0 || 'Username must not be empty'
                ]" />

                <!-- Password -->
                <v-text-field label="Password" v-model="password" :rules="[
                    n => n.length > 0 || 'Password must not be empty'
                ]" />


            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" :disabled="isSaveDisabled" @click="save">Save</v-btn>
            <v-btn color="primary" @click="emit('close')">Close</v-btn>
        </v-card-actions>
    </v-card>
</template>