<template>
  <div class="dish-card">
    <img :src="dish.image || defaultImage" :alt="dish.name" class="dish-image" />
    <div class="dish-info">
      <h3>{{ dish.name }}</h3>
      <p>{{ dish.description }}</p>
      <p class="price">{{ (dish.price).toFixed(2) }} €</p>
      <button @click="$emit('add-to-cart', dish)">Ajouter au panier</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dish: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      defaultImage: 'https://via.placeholder.com/200x150?text=Plat' // Image par défaut
    }
  }
}
</script>

<style scoped>
.dish-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  text-align: center;
  background-color: #fff;
}

.dish-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.dish-info {
  padding: 10px;
}

.dish-info h3 {
  margin: 10px 0;
  font-size: 1.2em;
}

.price {
  color: #28a745;
  font-weight: bold;
}

button {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}
</style>
