<template>
    <v-app id="inspire">
        <v-navigation-drawer permanent>
            <v-list>
                <v-list-item v-for="link in links" :key="link.key" router :to="link.to">
                    <template v-slot:prepend>
                        <v-icon>{{ link.icon }}</v-icon>
                    </template>

                    <v-list-item-title>{{ link.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <!-- Main window for the app -->
            <router-view v-slot="{ Component }">
                    <keep-alive>
                        <component :is="Component" />
                    </keep-alive>
            </router-view>
        </v-main>
    </v-app>
</template>

<script setup>
import { ref } from 'vue'

const links = ref([
    {
        title: 'Home',
        value: 'home',
        to: '/',
        icon: 'mdi-home'
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
        icon: 'mdi-account'
    },
    {
        title: 'Transactions',
        value: 'transactions',
        to: '/transactions',
        icon: 'mdi-currency-usd'
    },
])

</script>

<style>
.selected-row {
    background-color: #D6DBDF;
}
</style>