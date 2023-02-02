<script setup>
import { ref } from 'vue'
import NavigationDrawer from './components/layout/NavigationDrawer.vue'
import routes from '@/router/routes'

const links = ref(routes)

</script>

<template>
  <v-app>
    <NavigationDrawer :links="links" />

    <v-main class="h-100 d-flex flex-column">
      <RouterView />
    </v-main>
  </v-app>
</template>
