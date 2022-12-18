<script setup>
import { computed } from 'vue'
import deleteSubcategory from '@/composables/mutations/deleteSubcategory'
import getSubcategoryUsageInfo from '@/composables/queries/getSubcategoryUsageInfo'

// props 
const props = defineProps({
    item: Object
})

const emit = defineEmits([
    'close',
    'deleted'
])

const { gqlDeleteSubcategory, onDone, onError } = deleteSubcategory()

const { info, isReady, refetch } = getSubcategoryUsageInfo(props.item.id)

// need to refetch the data, otherwise it remembers an old cached result
refetch()

const message = computed(() => {
    if(info.value.isUsed) {
        return 'This subcategory is used by one or more payees and/or transactions. ' + 
                'Deleting this subcategory will uncategorize these payees and transactions. ' +
                'Continue?'
    } else {
        return 'This subcategory is not used by any payees or transactions. Continue?'
    }
})

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
    <v-card v-if="isReady">
        <v-card-title>Delete Subcategory '{{ item.name }}'</v-card-title>
        <v-card-text>
            {{ message }}
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" @click="del">Delete</v-btn>
            <v-btn color="primary" @click="close">Cancel</v-btn>
            
        </v-card-actions>
    </v-card>
</template>