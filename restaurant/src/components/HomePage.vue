<template>
  <div class="home-page">
    <h1>Bienvenue au Restaurant Le Délice</h1>
    <p>Découvrez nos délicieux plats préparés avec passion.</p>
    <router-link to="/menu" class="btn">Voir le Menu</router-link>
  </div>
</template>

<style scoped>
.home-page {
  text-align: center;
  padding: 2rem;
  background-color: #f9f9f9;
}

h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #007aff;
  color: #fff;
  font-weight: bold;
  text-decoration: none;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #005bb5;
}
</style>