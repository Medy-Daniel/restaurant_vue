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
  }
  
  .dish-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }
  
  .new-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: green;
    color: white;
    padding: 5px;
    border-radius: 3px;
  }
  
  button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
  }
  </style>