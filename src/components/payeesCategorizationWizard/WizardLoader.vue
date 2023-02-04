<script setup>
import { ref } from 'vue'

// components
import Wizard from './Wizard.vue'

// composables
import getPayees from '@/composables/queries/getPayees'
import Payee from '@/composables/model/Payee'

const props = defineProps({
    categories: Object
})

const emit = defineEmits([
    'save',
    'cancel'
])

// the uncategorized payees
const payees = ref(null)

// get all uncategorized payees
const { onResult } = getPayees({
    categorized: false
})

onResult(res => {
    payees.value = res.data.payees.items.map((p) => Payee.fromGql(p))
})

function handleSave(payees) {
    emit('save', payees)
}

</script>

<template>
<Wizard v-if="payees" :payees="payees" :categories="categories" @save="handleSave" @cancel="emit('cancel')"/>
</template>