<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/categories">Categories</RouterLink>
      </nav>
  </header>

  <RouterView />
</template>

