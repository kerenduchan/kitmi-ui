<script setup>
import { ref, computed } from 'vue'
import createCategory from '@/composables/mutations/createCategory'
import Category from '@/composables/model/Category'

// props 
const props = defineProps({
    categories: Object
})

const emit = defineEmits([
    'close',
    'created'
])

const { gqlCreateCategory, onDone, onError } = createCategory()

const name = ref('')
const isExpense = ref(true)
const isNameAlreadyExists = computed(() => {
    return (props.categories.find(c => c.name == name.value) !== undefined)
})

const isSaveDisabled = computed(() => {
    return name.value.length === 0 || isNameAlreadyExists.value === true
})

function save() {
    gqlCreateCategory({
        name: name.value,
        isExpense: isExpense.value
    })
}

onDone((res) => {
    const c = new Category(res.data.createCategory)
    emit('created', c)
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
        <v-card-title>Create Category</v-card-title>
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