<template>
    <div class="admin-orders">
      <h1>Gestion des Commandes</h1>
      <div v-if="orders.length === 0" class="no-orders">
        Aucune commande en cours
      </div>
      <div v-else class="order-list">
        <div v-for="order in orders" :key="order.id" class="order-item">
          <h2>Commande #{{ order.id }}</h2>
          <div class="order-details">
            <ul>
              <li v-for="item in order.items" :key="item.id">
                {{ item.name }} - Quantité : {{ item.quantity }}
              </li>
            </ul>
            <button 
              @click="markOrderReady(order.id)"
              :disabled="order.status === 'Prête'"
            >
              {{ order.status === 'Prête' ? 'Terminée' : 'Marquer comme prête' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue'
  import { cartStore } from '../stores/CartStore'
  
  export default {
    setup() {
      const orders = ref(cartStore.orders.value)
  
      const markOrderReady = (orderId) => {
        const orderIndex = orders.value.findIndex(order => order.id === orderId)
        if (orderIndex !== -1) {
          orders.value[orderIndex].status = 'Prête'
        }
      }
  
      return {
        orders,
        markOrderReady
      }
    }
  }
  </script>
  
  <style scoped>
  .admin-orders {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .order-item {
    border: 1px solid #ddd;
    margin-bottom: 15px;
    padding: 15px;
    border-radius: 5px;
  }
  
  .order-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
  }
  
  button:disabled {
    background-color: #cccccc;
  }
  </style>