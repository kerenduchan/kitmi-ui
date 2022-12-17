<script setup>
import { ref, computed } from 'vue'
import createSubcategory from '@/composables/mutations/createSubcategory'

// props 
const props = defineProps({
    category: Object
})

const emit = defineEmits([
    'close',
    'save'
])

const { gqlCreateSubcategory, onDone, onError } = createSubcategory()

const name = ref('')

const isNameAlreadyExists = computed(() => {
    if(!props.category.subcategories) {
        return false
    }
    return (props.category.subcategories.find(s => s.name == name.value) !== undefined)
})

const isSaveDisabled = computed(() => {
    return name.value.length === 0 || isNameAlreadyExists.value === true
})

function save() {
    gqlCreateSubcategory({
        name: name.value,
        categoryId: props.category.id
    })
}

onDone(() => {
    emit('save')
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
        <v-card-title>Create Subcategory</v-card-title>
        Category: {{ category.name }}
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
            <v-btn color="primary" @click="close">Close</v-btn>
            
        </v-card-actions>
    </v-card>
</template>