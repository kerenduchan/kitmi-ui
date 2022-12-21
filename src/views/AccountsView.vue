<script setup>
import { ref, computed } from 'vue'
import ButtonWithTooltip from '@/components/ButtonWithTooltip.vue'
import AccountsList from '@/components/AccountsList.vue'
import EditAccount from '@/components/EditAccount.vue'
import DeleteAccount from '@/components/DeleteAccount.vue'
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
    const found = accounts.value.find(a => a.id === selectedAccountId.value)
    return found ? found : null
})

// Serves in order to force the selected account to be what we want
const forceSelectedAccountId = ref(null)

// update the selected account
function handleSelect(accountId) {
    selectedAccountId.value = accountId
    forceSelectedAccountId.value = null
}

// edit account dialog
const showEditDialog = ref(false)

function handleChange() {
    showEditDialog.value = false
    showDeleteDialog.value = false
    store.refetchAccounts()
}

// create account dialog
const showCreateDialog = ref(false)

// delete account dialog
const showDeleteDialog = ref(false)

// IDs of accounts used by one or more transactions
const usedAccountIds = computed(() => {
    const allAccountIds = accounts.value.map(a => a.id)
    return allAccountIds.filter(accountId =>
        store.transactions.value.find(t => t.accountId === accountId) !== undefined)
})

const isDeleteDisabled = computed(() => {
    // Delete is disabled if:
    // - No account is selected, or 
    // - The selected account is used in one or more transactions.
    return !selectedAccountId.value || usedAccountIds.value.includes(selectedAccountId.value)
})

function handleAccountCreated(accountId) {
    // select the newly created account
    forceSelectedAccountId.value = accountId
    showCreateDialog.value = false
    store.refetchAccounts()
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

            <!-- Delete account button -->
            <div class="top-bar-action">
                <ButtonWithTooltip 
                    tooltip="Delete account" 
                    icon="mdi-delete"
                    :disabled="isDeleteDisabled"
                    @click="showDeleteDialog = true"
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
        :forceSelectedAccountId="forceSelectedAccountId"
        @select="handleSelect" />

    <!-- Edit selected account dialog -->
    <v-dialog v-model="showEditDialog">
        <EditAccount 
            :account="selectedAccount"
            :accounts="accounts"
            @close="showEditDialog = false"
            @save="handleChange" />
    </v-dialog>

    <!-- Delete selected account dialog -->
    <v-dialog v-model="showDeleteDialog">
        <DeleteAccount 
            :account="selectedAccount"
            @close="showDeleteDialog = false"
            @deleted="handleChange" />
    </v-dialog>

    <!-- Create account dialog -->
    <v-dialog v-model="showCreateDialog">
        <CreateAccount 
            :accounts="accounts"
            @close="showCreateDialog = false"
            @created="handleAccountCreated" 
        />
    </v-dialog>

</template>