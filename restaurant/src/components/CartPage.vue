<template>
    <div>
      <h1>Panier</h1>
      <table>
        <thead>
          <tr>
            <th>Plat</th>
            <th>Quantité</th>
            <th>Prix</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cart" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ (item.price * item.quantity) }} €</td>
            <td>
                <button @click="clearCart">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p>Total: {{ totalPrice }} €</p>
      <button @click="clearCart">Vider le panier</button>
    </div>
  </template>
  
  <script>
  import { cartStore } from '../stores/CartStore'
  
  export default {
    name: 'CartPage',
    computed: {
    cart() {
        return cartStore.cart;
    },
    totalPrice() {
        try {
            return cartStore.totalPrice;
        } catch (error) {
            console.error('Erreur lors du calcul du prix total :', error);
            return 0; // Ou une valeur par défaut
        }
    }
},
    methods: {
      removeFromCart(dishId) {
        cartStore.removeFromCart(dishId)
      },
      clearCart() {
        cartStore.clearCart()
      }
    }
  }
  </script>