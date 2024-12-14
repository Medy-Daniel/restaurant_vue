<template>
    <div class="dish-item">
      <h3>{{ dish.name }}</h3>
      <p>{{ dish.description }}</p>
      <div class="dish-footer">
        <span class="price">{{ dish.price.toFixed(2) }} €</span>
        <button @click="addToCart">Ajouter au panier</button>
      </div>
      <span v-if="dish.isNew" class="new-badge">Nouveau</span>
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
    methods: {
      addToCart() {
        this.$emit('add-to-cart', this.dish)
      }
    }
  }
  </script>
  
  <style scoped>
  .dish-item {
  border: 1px solid #ddd;
  padding: 15px;
  position: relative;
  text-align: center;
  background-color: white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 8px;
  margin-top: 2rem;
}

.dish-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 45px;
}

.new-badge {
  position: absolute;
  top: 100px;
  right: 84px;
  background-color: green;
  color: white;
  padding: 5px 10px;
  border-radius: 16px;
  font-size: 12px;
}

button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #45a049;
}
  </style>