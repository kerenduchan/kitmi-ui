<script setup>
import { ref, computed } from 'vue'

// props 
const props = defineProps({
    // subcategory is null for create or an object for edit
    subcategory: Object,
    
    // the default selected category ID
    categoryId: String,

    // all the categories and their subcategories
    categories: Object
})

const emit = defineEmits([
    'close',
    'save'
])

// v-models for form fields
const name = ref(props.subcategory ? props.subcategory.name : '')

// For edit, category ID should be the given subcategory's category ID.
// For update, category ID should be the given default category ID.
const categoryId = ref(props.subcategory ? props.subcategory.categoryId : props.categoryId)

const subcategories = computed(() => {
    let res = []
    props.categories.forEach(c => { 
        res.concat(c.subcategories) 
    })
    return res
})

const isNameAlreadyExists = computed(() => {
    return subcategories.value.find(s => s.name == name.value) !== undefined
})

const isSaveDisabled = computed(() => {
    return name.value.length === 0 || isNameAlreadyExists.value === true
})

const title = computed(() => {
    if(props.subcategory) {
        return "Edit Subategory '" + props.subcategory.name + "'"
    }
    return "Create Subategory"
})

function save() {
    const subcategory = { 
        name: name.value,
        categoryId: categoryId.value
    }
    if(props.subcategory) {
        // for update
        subcategory.subcategoryId = props.subcategory.id
    }
    emit('save', subcategory)
}

</script>

<template>
    <v-card>
        <v-card-title>{{ title }}</v-card-title>
        <v-card-text>
            <v-form>

                <!-- Category -->
                <v-select 
                    label="Category" 
                    :items="categories" 
                    item-title="name" 
                    item-value="id" 
                    v-model="categoryId" />

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