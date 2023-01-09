<script setup>
import { ref } from 'vue'

// props 
const props = defineProps({
    label: String,
    text: String,
    title: String
})

const emit = defineEmits([
    'close',
    'save'
])

const text = ref(props.text)

function save() {
    emit('save', text.value)
}

</script>

<template>
    <v-card>
        <v-card-title>{{ title }}</v-card-title>
        <v-card-text>
            <v-form>
                <!-- Text -->
                <v-text-field 
                    :label="label" 
                    v-model="text" 
                />
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" @click="save">Save</v-btn>
            <v-btn color="primary" @click="emit('close')">Close</v-btn>
        </v-card-actions>
    </v-card>
</template>