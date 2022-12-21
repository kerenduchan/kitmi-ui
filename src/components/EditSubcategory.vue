<script setup>
import { ref, computed } from 'vue'
import updateSubcategory from '@/composables/mutations/updateSubcategory'

// props 
const props = defineProps({
    subcategory: Object,
    categories: Object
})

const emit = defineEmits([
    'close',
    'save'
])

const { gqlUpdateSubcategory, onDone, onError } = updateSubcategory()

const name = ref(props.subcategory.name)
const categoryId = ref(props.subcategory.categoryId)

const subcategories = computed(() => {
    let res = []
    props.categories.forEach(c => { 
        res.concat(c.subcategories) 
    })
    return res
})

const isNameAlreadyExists = computed(() => {
    return (name.value != props.subcategory.name && 
        subcategories.value.find(s => s.name == name.value) !== undefined)
})

const isSaveDisabled = computed(() => {
    return name.value.length === 0 || isNameAlreadyExists.value === true
})

function save() {
    gqlUpdateSubcategory({
        subcategoryId: props.subcategory.id,
        name: name.value,
        categoryId: categoryId.value
    })
}

function close() {
    emit('close')
}

onDone(() => {
    emit('save')
})

onError((e) => {
    console.error(e)
})

</script>

<template>
    <v-card>
        <v-card-title>Edit Subcategory '{{ subcategory.name }}'</v-card-title>
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

            <v-select label="Category" :items="categories" item-title="name" item-value="id" v-model="categoryId" />

        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" :disabled="isSaveDisabled" @click="save">Save</v-btn>
            <v-btn color="primary" @click="close">Close</v-btn>
            
        </v-card-actions>
    </v-card>
</template>