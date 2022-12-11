<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/categories">Categories</RouterLink>
        <RouterLink to="/payees">Payees</RouterLink>
      </nav>
  </header>

  <RouterView />
</template>

