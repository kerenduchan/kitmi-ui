<template>
    <v-app>
        <v-app-bar flat>
            <!-- Top bar for the app -->
            <v-container class="fill-height d-flex align-center">
                <v-btn v-for="link in links" :key="link.key" variant="text" router :to="link.to">
                    {{ link.title }}
                </v-btn>

                <v-spacer></v-spacer>

                <v-responsive max-width="260">
                    <v-text-field density="compact" hide-details variant="solo"></v-text-field>
                </v-responsive>
            </v-container>
        </v-app-bar>
        <v-main class="bg-grey-lighten-3">
            <!-- Main window for the app -->
            <v-container>
                <v-row>
                    <v-col>
                        <v-sheet min-height="70vh" rounded="lg">
                            <!--  -->
                            <RouterView />
                        </v-sheet>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup>
import { ref, watch } from 'vue'
const drawer = ref(false)
const group = ref(null)
const links = ref([
    {
        title: 'Home',
        value: 'home',
        to: '/'
    },
    {
        title: 'Categories',
        value: 'categories',
        to: '/categories'
    },
    {
        title: 'Payees',
        value: 'payees',
        to: '/payees'
    },
    {
        title: 'Transactions',
        value: 'transactions',
        to: '/transactions'
    },
])

watch(group, () => {
    drawer.value = false
})
</script>
