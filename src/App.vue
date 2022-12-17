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
    {
        title: 'Summary',
        value: 'summary',
        to: '/summary',
        icon: 'mdi-star'
    },
])

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