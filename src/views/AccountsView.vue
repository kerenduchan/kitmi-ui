<script setup>
import { ref, computed } from 'vue'

// components
import ButtonWithTooltip from '@/components/ButtonWithTooltip.vue'
import Snackbar from '@/components/Snackbar.vue'
import AccountsList from '@/components/AccountsList.vue'
import CreateAccount from '@/components/CreateAccount.vue'
import EditAccount from '@/components/EditAccount.vue'
import AreYouSure from '@/components/AreYouSure.vue'

// composables
import getStore from '@/composables/store'
import getCreateAccount from '@/composables/mutations/createAccount'
import getDeleteAccount from '@/composables/mutations/deleteAccount'

const store = getStore()
const accounts = store.accounts

// ----------------------------------------------------------------------------
// snackbar
const showSnackbar = ref(false)
const snackbarText = ref('')

function displaySnackbar(text) {
    snackbarText.value = text
    showSnackbar.value = true
}

// ----------------------------------------------------------------------------
// selected account

// the ID of the selected account
const selectedAccountId = ref(null)

// The selected account
const selectedAccount = computed(() => {
    if(!selectedAccountId.value) {
        return null
    }
    const found = accounts.value.find(a => a.id === selectedAccountId.value)
    return found ? found : null
})

// update the selected account
function handleSelect(accountId) {
    selectedAccountId.value = accountId
}

// ----------------------------------------------------------------------------
// edit account
const showEditDialog = ref(false)

function handleAccountEdited() {
    showEditDialog.value = false
    store.refetchAccounts()
}

// ----------------------------------------------------------------------------
// delete account
const showDeleteDialog = ref(false)

function getDeleteAccountTitle() {
    if(selectedAccount.value) {
        return "Delete Account '" + selectedAccount.value.name + "'"
    }
    return ''
} 
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

const { 
    gqlDeleteAccount, 
    onDone: onDeleteAccountDone, 
    onError: onDeleteAccountError
} = getDeleteAccount()

function deleteAccount() {
    gqlDeleteAccount({
        accountId: selectedAccountId.value
    })
}

onDeleteAccountDone((res) => {
    const name = selectedAccount.value.name
    selectedAccountId.value = null
    showDeleteDialog.value = false
    store.refetchAccounts()
    displaySnackbar("Account '" + name + "' deleted.")
})

onDeleteAccountError((e) => {
    showDeleteDialog.value = false
    displaySnackbar("Failed to delete account '" + selectedAccount.value.name + "'.")
    console.error(e)
})

// ----------------------------------------------------------------------------
// create account
const showCreateDialog = ref(false)

const { 
    gqlCreateAccount, 
    onDone: onCreateAccountDone, 
    onError: onCreateAccountError
} = getCreateAccount()

onCreateAccountDone((res) => {
    const account = res.data.createAccount
    selectedAccountId.value = account.id
    showCreateDialog.value = false
    store.refetchAccounts()
    displaySnackbar("Account '" + account.name + "' created.")
})

onCreateAccountError((e) => {
    displaySnackbar("Failed to create account.")
    console.error(e)
})

function createAccount(account) {
    gqlCreateAccount({
        name: account.name,
        source: account.source,
        username: account.username,
        password: account.password,
    })
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
                    :disabled="!selectedAccountId"
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
        :selectedAccountId="selectedAccountId"
        :accounts="accounts" 
        @select="handleSelect" />

    <!-- snackbar -->
    <Snackbar 
        :show="showSnackbar" 
        :text="snackbarText"
        @close="showSnackbar = false"/>

    <!-- Edit selected account dialog -->
    <v-dialog v-model="showEditDialog">
        <EditAccount 
            :account="selectedAccount"
            :accounts="accounts"
            @close="showEditDialog = false"
            @save="handleAccountEdited" />
    </v-dialog>

    <!-- Delete selected account dialog -->
    <v-dialog v-model="showDeleteDialog">
        <AreYouSure 
            :title="getDeleteAccountTitle()"
            @cancel="showDeleteDialog = false"
            @yes="deleteAccount" 
        />
    </v-dialog>

    <!-- Create account dialog -->
    <v-dialog v-model="showCreateDialog">
        <CreateAccount 
            :accounts="accounts"
            @close="showCreateDialog = false"
            @save="createAccount" 
        />
    </v-dialog>

</template>