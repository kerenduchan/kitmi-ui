<script setup>
import deleteCategory from '@/composables/mutations/deleteCategory'

// props 
const props = defineProps({
    category: Object
})

const emit = defineEmits([
    'close',
    'deleted'
])

const { gqlDeleteCategory, onDone, onError } = deleteCategory()

function del() {
    gqlDeleteCategory({
        categoryId: props.category.id
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
    <v-card v-if="category">
        <v-card-title>Delete Category '{{ category.name }}'</v-card-title>
        <v-card-text>
            Are you sure?
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" @click="del">Delete</v-btn>
            <v-btn color="primary" @click="close">Cancel</v-btn>
            
        </v-card-actions>
    </v-card>
</template>