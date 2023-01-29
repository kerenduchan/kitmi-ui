<script setup>
import { ref, computed } from 'vue'

// components
import ButtonWithTooltip from '@/components/ButtonWithTooltip.vue'
import Snackbar from '@/components/Snackbar.vue'
import AccountsList from '@/components/AccountsList.vue'
import CreateOrEditAccount from '@/components/CreateOrEditAccount.vue'
import AreYouSure from '@/components/AreYouSure.vue'

// composables
import snackbar from '@/composables/snackbar'
import getCreateAccount from '@/composables/mutations/createAccount'
import getUpdateAccount from '@/composables/mutations/updateAccount'
import getDeleteAccount from '@/composables/mutations/deleteAccount'
import getAccounts from '@/composables/queries/getAccounts'

// ----------------------------------------------------------------------------
// accounts (from the server)
const accounts = ref(null)

const { onResult, refetch } = getAccounts()

onResult(res => {
    accounts.value = res.data.accounts
})


// ----------------------------------------------------------------------------
// snackbar
const { showSnackbar, snackbarText, displaySnackbar } = snackbar()

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
// create / edit account

const showCreateOrEditDialog = ref(false)

// null for create, the selected account for edit
const accountForCreateOrEditDialog = ref(null)

function openCreateOrEditDialog(isCreate) {
    accountForCreateOrEditDialog.value = isCreate ? null : selectedAccount.value
    showCreateOrEditDialog.value = true
}

function closeCreateOrEditDialog() {
    showCreateOrEditDialog.value = false
}

function handleSaveOnCreateOrEditAccount(account) {
    if(accountForCreateOrEditDialog.value) {
        updateAccount(account)
    } else {
        createAccount(account)
    }
}

// ----------------------------------------------------------------------------
// create account

const { 
    createAccount, 
    onDone: onCreateAccountDone, 
    onError: onCreateAccountError
} = getCreateAccount()

onCreateAccountDone((res) => {
    const account = res.data.createAccount
    selectedAccountId.value = account.id
    closeCreateOrEditDialog()
    refetch()
    displaySnackbar("Account '" + account.name + "' created.")
})

onCreateAccountError((e) => {
    displaySnackbar("Failed to create account.")
    console.error(e)
})

// ----------------------------------------------------------------------------
// edit account

const { 
    updateAccount, 
    onDone: onUpdateAccountDone, 
    onError: onUpdateAccountError
} = getUpdateAccount()


onUpdateAccountDone((res) => {
    const account = res.data.updateAccount
    const name = account.name
    closeCreateOrEditDialog()
    refetch()
    displaySnackbar("Account '" + name + "' updated.")
})

onUpdateAccountError((e) => {
    displaySnackbar("Failed to update account '" + selectedAccount.value.name + "'.")
    console.error(e)
})

// ----------------------------------------------------------------------------
// delete account
const showDeleteDialog = ref(false)

function getDeleteAccountTitle() {
    if(selectedAccount.value) {
        return "Delete Account '" + selectedAccount.value.name + "'"
    }
    return ''
} 

const isDeleteDisabled = computed(() => {
    // Delete is disabled if:
    // - No account is selected, or 
    // - The selected account is used in one or more transactions.
    return !selectedAccountId.value
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
    refetch()
    displaySnackbar("Account '" + name + "' deleted.")
})

onDeleteAccountError((e) => {
    showDeleteDialog.value = false
    displaySnackbar("Failed to delete account '" + selectedAccount.value.name + "'.")
    console.error(e)
})

</script>

<template>
    <!-- actions bar at the top -->
    <div id="actions-bar">
        
        <!-- actions at the start of the actions bar -->
        <div class="actions">

            <!-- Edit account button -->
            <div>
                <ButtonWithTooltip 
                    tooltip="Edit account" 
                    icon="mdi-pencil"
                    :disabled="!selectedAccountId"
                    @click="openCreateOrEditDialog(false)"
                />
            </div>

            <!-- Delete account button -->
            <div>
                <ButtonWithTooltip 
                    tooltip="Delete account" 
                    icon="mdi-delete"
                    :disabled="isDeleteDisabled"
                    @click="showDeleteDialog = true"
                />
            </div>

        </div>

        <!-- actions at the end of the actions bar -->
        <div class="actions">

            <!-- Create account button -->
            <div>
                <ButtonWithTooltip 
                    tooltip="Create account"
                    icon="mdi-plus"
                    @click="openCreateOrEditDialog(true)"
                />
            </div>
        </div>
    </div>

    <!-- content -->
    <div id="content" v-if="accounts">
        <div id="content-title">
            Accounts
        </div>
        <div id="content-main">
            <v-card variant="outlined">
                <v-card-text>
                    <!-- List (table) of accounts -->
                    <div class="scrollable">
                        <AccountsList :selectedAccountId="selectedAccountId" :accounts="accounts" @select="handleSelect" />
                    </div>
                </v-card-text>
            </v-card>
        </div>
    </div>

    <!-- snackbar -->
    <Snackbar 
        :show="showSnackbar" 
        :text="snackbarText"
        @close="showSnackbar = false"/>

    <!-- Create or edit account dialog -->
    <v-dialog v-model="showCreateOrEditDialog">
        <CreateOrEditAccount
            :account="accountForCreateOrEditDialog"
            :accounts="accounts"
            @close="closeCreateOrEditDialog()"
            @save="handleSaveOnCreateOrEditAccount" 
        />
    </v-dialog>

    <!-- Delete selected account dialog -->
    <v-dialog v-model="showDeleteDialog">
        <AreYouSure 
            :title="getDeleteAccountTitle()"
            @cancel="showDeleteDialog = false"
            @yes="deleteAccount" 
        />
    </v-dialog>

</template>