<template>
  <div id="app">
    <header>
      <nav>
        <RouterLink to="/">Accueil</RouterLink>
        <RouterLink to="/menu">Menu</RouterLink>
        <RouterLink to="/cart">Panier</RouterLink>
        <RouterLink to="/admin/orders">Commandes</RouterLink>
      </nav>
    </header>

    <RouterView v-slot="{ Component }">
      <component :is="Component" />
    </RouterView>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>
#app {
  font-family: Arial, sans-serif;
}

header {
  background-color: #f8f9fa;
  padding: 1rem;
  text-align: center;
  box-shadow: 1 2px 4px rgba(0,0,0,0.1);
}

nav {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

nav a {
  text-decoration: none;
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

nav a:hover, nav a.router-link-exact-active {
  background-color: #e9ecef;
}
</style>