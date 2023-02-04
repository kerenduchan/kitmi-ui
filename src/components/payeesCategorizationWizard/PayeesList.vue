<script setup>

const props = defineProps({
    payeesDraft: Object,
    payeeDraft: Object
})

const emit = defineEmits([
    'select'
])

function getClass(idx) {
    if(props.payee === null) {
        return ''
    }

    let classes = []
    const payeeDraft = props.payeesDraft[idx]
    if(props.payeeDraft.payee.id === payeeDraft.payee.id) {
        classes.push('bg-secondary')
    }
    if(payeeDraft.subcategory !== null) {
        classes.push('text-excluded')
    }
    return classes.join(' ');
}

</script>

<template>
    <v-card variant="outlined" class="mr-4 flex-grow-0 flex-shrink-0 d-flex flex-column">
        <v-card-title>
            Payees
        </v-card-title>
        <v-card-text class="pa-0 mb-4 overflow-y-auto">
            <table class="ma-0 w-100">
                <tbody>
                    <tr v-for="payeeDraft, idx in payeesDraft" @click="emit('select', idx)" :class="getClass(idx)">
                        <td class="ps-3">{{ idx + 1 }}</td>
                        <td class="payee-name-cell pe-3">{{ payeeDraft.payee.name }}</td>
                    </tr>
                </tbody>
            </table>
        </v-card-text>
    </v-card>
</template>

<style scoped>

.v-card {
    max-width: 200px;
}

td,
th {
  padding: 0px 6px;
  height: 24px;
}

.payee-name-cell {
    white-space: nowrap
}

</style>