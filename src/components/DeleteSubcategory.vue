<script setup>
import deleteSubcategory from '@/composables/mutations/deleteSubcategory'

// props 
const props = defineProps({
    item: Object
})

const emit = defineEmits([
    'close',
    'deleted'
])

const { gqlDeleteSubcategory, onDone, onError } = deleteSubcategory()

function del() {
    gqlDeleteSubcategory({
        subcategoryId: props.item.id
    })
}

onDone(() => {
    emit('deleted', props.item)
})

onError((e) => {
    console.error(e)
})

function close() {
    emit('close')
}

</script>

<template>
    <v-card>
        <v-card-title>Delete Subcategory '{{ item.name }}'</v-card-title>
        <v-card-text>
            Are you sure?
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" @click="del">Delete</v-btn>
            <v-btn color="primary" @click="close">Cancel</v-btn>
            
        </v-card-actions>
    </v-card>
</template>