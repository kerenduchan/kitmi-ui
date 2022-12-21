<script setup>
import { ref, computed } from 'vue'
import ButtonWithTooltip from '@/components/ButtonWithTooltip.vue'
import AccountsList from '@/components/AccountsList.vue'
import EditAccount from '@/components/EditAccount.vue'
import CreateAccount from '@/components/CreateAccount.vue'
import getStore from '@/composables/store'

const store = getStore()
const accounts = store.accounts

// the ID of the selected account
const selectedAccountId = ref(null)

// The selected account
const selectedAccount = computed(() => {
    if(selectedAccountId.value === null) {
        return null
    }
    const found = props.accounts.value.find(a => a.id === selectedAccountId.value)
    return found ? found : null
})

// update the selected item
function handleSelect(accountId) {
    selectedAccountId.value = accountId
}

// edit account dialog
const showEditDialog = ref(false)

function handleChange() {
    showEditDialog.value = false
    store.refetchAccounts()
}

// create account dialog

const showCreateDialog = ref(false)

function handleAccountCreated() {

}

</script>

<template>
    <div class="top-bar">
        <div class="top-bar-left">

            <!-- Edit account button -->
            <div class="top-bar-action">
                <ButtonWithTooltip 
                    tooltip="Edit account" 
                    icon="mdi-pencil"
                    :disabled="selectedAccountId === null"
                    @click="showEditDialog = true"
                />
            </div>
        </div>

        <div class="top-bar-right">

            <!-- Create account button -->
            <div class="top-bar-action">
                <ButtonWithTooltip 
                    tooltip="Create account"
                    icon="mdi-plus"
                    @click="showCreateDialog = true"
                />
            </div>
        </div>
    </div>
    <v-divider />

    <!-- List (table) of accounts -->
    <AccountsList 
        :accounts="accounts" 
        @select="handleSelect" />

    <!-- Edit selected account dialog -->
    <v-dialog v-model="showEditDialog">
        <EditAccount 
            :account="accountForEditDialog"
            @close="showEditDialog = false"
            @change="handleChange" />
    </v-dialog>

    <!-- Create account dialog -->
    <v-dialog v-model="showCreateDialog">
        <CreateAccount 
            @close="showCreateDialog = false"
            @created="handleAccountCreated" 
        />
    </v-dialog>

</template>