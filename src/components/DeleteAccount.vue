<script setup>
import deleteAccount from '@/composables/mutations/deleteAccount'

// props 
const props = defineProps({
    account: Object
})

const emit = defineEmits([
    'close',
    'deleted'
])

const { gqlDeleteAccount, onDone, onError } = deleteAccount()

function del() {
    gqlDeleteAccount({
        accountId: props.account.id
    })
}

onDone(() => {
    emit('deleted')
})

onError((e) => {
    console.error(e)
})

function close() {
    emit('close')
}

</script>

<template>
    <v-card v-if="account">
        <v-card-title>Delete Account '{{ account.name }}'</v-card-title>
        <v-card-text>
            Are you sure?
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" @click="del">Delete</v-btn>
            <v-btn color="primary" @click="close">Cancel</v-btn>
            
        </v-card-actions>
    </v-card>
</template>