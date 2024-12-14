<template>
  <div>
    <h1>Panier</h1>
    <table>
      <thead>
        <tr>
          <th>Plat</th>
          <th>Quantité</th>
          <th>Prix Unitaire</th>
          <th>Prix Total</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <!-- Boucle sur les produits dans le panier -->
        <tr v-for="item in cart" :key="item.id">
          <td>{{ item.name }}</td>
          <td>
            <!-- Boutons pour ajuster la quantité -->
            <button @click="decreaseQuantity(item.id)">-</button>
            {{ item.quantity }}
            <button @click="increaseQuantity(item)">+</button>
          </td>
          <td>{{ item.price }} €</td>
          <td>{{ (item.price * item.quantity).toFixed(2) }} €</td>
          <td>
            <!-- Bouton pour supprimer un produit -->
            <button @click="removeFromCart(item.id)">Supprimer</button>
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
      return cartStore.cart
    },
    totalPrice() {
      // Calcule le prix total des produits dans le panier
      return this.cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
    }
  },
  methods: {
    increaseQuantity(dish) {
      // Ajoute une unité au produit sélectionné
      cartStore.addToCart(dish)
    },
    decreaseQuantity(dishId) {
      // Réduit la quantité ou supprime si elle atteint 0
      cartStore.decreaseQuantity(dishId)
    },
    removeFromCart(dishId) {
      cartStore.removeFromCart(dishId)
    },
    clearCart() {
      // Vide entièrement le panier
      cartStore.clearCart()
    }
  }
}
</script>
