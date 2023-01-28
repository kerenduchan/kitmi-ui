<template>
    <v-app fluid fill-height>
            <!-- Navigation drawer -->
            <v-navigation-drawer v-model="drawer" :rail="rail" permanent :width="190" color="grey">
            <v-list>
                <!-- Arrow for expanding/collapsing the navigation drawer -->
                <v-list-item>
                    <v-list-item-title>
                        <v-btn class="rounded-0" elevation="0" variant="text"
                            :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'" @click.stop="rail = !rail" />
                    </v-list-item-title>
                </v-list-item>
                <!-- Navigation (router) links -->
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

        <!-- Main window for the app -->
        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script setup>
import { ref } from 'vue'

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
        icon: 'mdi-folder-multiple'
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
</script>
