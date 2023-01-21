<template>
    <v-app v-if="isReady" id="inspire">
        <v-navigation-drawer 
            v-model="drawer"
            :rail="rail"
            permanent
        >
            <v-list>
                <v-list-item>
                    <v-list-item-title>
                        <v-btn
                            class="rounded-0" 
                            elevation="0"
                            variant="text"
                            :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
                            @click.stop="rail = !rail"
                        />
                    </v-list-item-title>
                </v-list-item>
                <v-list-item v-for="link in links" :key="link.key" router :to="link.to">
                    <template v-slot:prepend>
                        <v-tooltip :disabled="!rail" :text="link.title">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props">{{ link.icon }}</v-icon>
                            </template>
                        </v-tooltip>
                    </template>
                    <v-list-item-title>{{ link.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <!-- Main window for the app -->
            <router-view />
        </v-main>
    </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import getStore from '@/composables/store'

const rail = ref(true)
const drawer = ref(true)

const links = ref([
    {
        title: 'Home',
        value: 'home',
        to: '/',
        icon: 'mdi-home'
    },
    {
        title: 'Accounts',
        value: 'accounts',
        to: '/accounts',
        icon: 'mdi-bank-transfer'
    },
    {
        title: 'Categories',
        value: 'categories',
        to: '/categories',
        icon: 'mdi-folder'
    },
    {
        title: 'Payees',
        value: 'payees',
        to: '/payees',
        icon: 'mdi-hand-coin'
    },
    {
        title: 'Transactions',
        value: 'transactions',
        to: '/transactions',
        icon: 'mdi-currency-usd'
    },
    {
        title: 'Balance',
        value: 'balance',
        to: '/balance',
        icon: 'mdi-scale-balance'
    },
    {
        title: 'Charts',
        value: 'charts',
        to: '/charts',
        icon: 'mdi-poll'
    },
])

// fetch accounts, categories, payees, transactions from the server
const store = getStore()
store.fetchAccounts()
store.fetchCategories()
store.fetchPayees()

const isReady = computed(() => {
    return store.accounts.value !== null &&
        store.payees.value !== null &&
        store.accounts.value !== null
})

</script>

<style>
.top-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 80px;
}

.top-bar-left {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
}

.top-bar-right {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
}

.top-bar-action {
    align-self: center;
    padding: 10px;
}

.selected-row {
    background-color: #D6DBDF;
}
</style>