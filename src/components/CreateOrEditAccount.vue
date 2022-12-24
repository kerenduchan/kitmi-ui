<script setup>
import { ref, computed } from 'vue'

// props 
const props = defineProps({
    // account is null for create or an object for edit
    account: Object,
    accounts: Object
})

// emits
const emit = defineEmits([
    'close',
    'save'
])

// v-models for the form fields
const name = ref(props.account ? props.account.name : '')
const source = ref(props.account ? props.account.source : '')
const username = ref(props.account ? props.account.username : '')
const password = ref(props.account ? props.account.password : '')

const isNameAlreadyExists = computed(() => {
    if(props.account && name.value == props.account.name) {
        return false
    }
    return props.accounts.find(a => a.name == name.value) !== undefined
})

const isSaveDisabled = computed(() => {
    return name.value.length === 0 || 
        isNameAlreadyExists.value === true ||
        source.value.length === 0 ||
        username.value.length === 0 ||
        (!props.account && password.value.length === 0)
})

const title = computed(() => {
    if(props.account) {
        return "Edit Account '" + props.account.name + "'"
    }
    return "Create Account"
})

function save() {
    const account = { 
        name: name.value,
        source: source.value,
        username: username.value,
        // null for password in edit mode means don't change password
        password: (password.length === 0 ? null : password.value)
    }
    if(props.account) {
        // for update
        account.accountId = props.account.id
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

const passwordRules = computed(() => {
    if(props.account) {
        // edit account - leaving the password field empty is valid (don't update password)
        return []
    }
    return [ n => n.length > 0 || 'Password must not be empty' ]
})

</script>

<template>
    <v-card>
        <v-card-title>{{ title }}</v-card-title>
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
                <v-text-field 
                    type="password" 
                    autocomplete="on"
                    label="Password" 
                    v-model="password" 
                    :rules="passwordRules" />


            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" :disabled="isSaveDisabled" @click="save">Save</v-btn>
            <v-btn color="primary" @click="emit('close')">Close</v-btn>
        </v-card-actions>
    </v-card>
</template>