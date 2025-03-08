<template>
  <div class="cart-container">
    <!-- En-tête du tableau -->
    <div class="cart-header">
      <div class="header-item">Produit</div>
      <div class="header-item">Quantité</div>
      <div class="header-item">Sous-total</div>
    </div>

    <!-- Produits -->
    <div class="cart-items">
      <div v-for="item in cart" :key="item.id" class="cart-item">
        <div class="product-info">
          <img :src="item.image_url" :alt="item.name" />
          <div class="product-details">
            <h3>{{ item.name }}</h3>
            <p class="price">{{ item.price }} €</p>
          </div>
        </div>
        <div class="quantity-controls">
          <button @click="decreaseQuantity(item.id)">−</button>
          <input type="text" :value="item.quantity" readonly />
          <button @click="increaseQuantity(item)">+</button>
        </div>
        <div class="subtotal">
          {{ (item.price * item.quantity).toFixed(2) }} €
          <button class="delete-btn" @click="removeFromCart(item.id)">
            <span class="trash-icon">🗑</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Résumé -->
    <div v-if="cart.length > 0" class="cart-summary">
      <div class="summary-box">
        <h2>Total panier</h2>
        <div class="summary-row">
          <span>Sous-total</span>
          <span>{{ cartTotal }} €</span>
        </div>
        <div class="summary-row total">
          <span>Total</span>
          <div class="total-amount">
            <span class="amount">{{ cartTotal }} €</span>
            <span class="TVA"
              >(dont {{ cartTVA }} € de TVA à 20% (oui on as pensé à la
              TVA))</span
            >
          </div>
        </div>
        <button @click="submitOrder" class="checkout-btn">
          Valider la commande →
        </button>
      </div>
    </div>

    <!-- Panier vide -->
    <div v-if="cart.length === 0" class="empty-cart">
      Votre panier est vide.
      <RouterLink to="/menu">Retourner au menu</RouterLink>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { api } from '../services/api';

export default {
  name: "CartPage",
  setup() {
    const cart = ref(JSON.parse(localStorage.getItem('cart')) || []);
    const cartTotal = ref("0.00");
    const cartTVA = ref("0.00");
    const router = useRouter();

    const calculateTotal = (cartItems) => {
      const total = cartItems
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toFixed(2);
      cartTotal.value = total;
      cartTVA.value = (total * 0.2).toFixed(2);
    };


    const increaseQuantity = (dish) =>{
      const found = cart.value.find((item) => item.id === dish.id);
      if (found) {
        found.quantity += 1;
      }else {
        cart.value.push({ ...dish, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(cart.value));
    }

    const decreaseQuantity = (dishId) => {
      const found = cart.value.find((item) => item.id === dishId);
      if (found) {
        found.quantity -= 1;
        if (found.quantity <= 0) {
          removeFromCart(dishId);
        }
        localStorage.setItem('cart', JSON.stringify(cart.value));
      }
    };

    const removeFromCart = (dishId) => {
      const index = cart.value.findIndex((item) => item.id === dishId);
      if (index !== -1) {
        cart.value.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart.value));
      }
    };

    const submitOrder = async () => {
      try {
        const orderDetails = {
          total_amount: parseFloat(cartTotal.value),
          vat_amount: parseFloat(cartTVA.value),
          items: cart.value.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            unit_price: item.price
          }))
        };

        const response = await api.createOrder(orderDetails);
        localStorage.removeItem('cart');
        router.push(`/order-confirmation/${response.orderId}`);
      } catch (error) {
        console.error('Erreur lors de la création de la commande:', error);
      }
    };

    watch(
      cart,
      (newCart) => {
        calculateTotal(newCart);
      },
      { deep: true, immediate: true }
    );

    return {
      cart,
      cartTotal,
      cartTVA,
      submitOrder,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
    };
  },
};
</script>




<style scoped>
.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.cart-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
  font-weight: 500;
}

.cart-items {
  margin-top: 1rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  padding: 1.5rem 0;
  border-bottom: 1px solid #eee;
  align-items: center;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.product-info img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.product-details h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.price {
  color: #666;
  margin: 0;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-controls button {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.quantity-controls input {
  width: 40px;
  height: 30px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.subtotal {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  opacity: 0.6;
}

.delete-btn:hover {
  opacity: 1;
}

.cart-summary {
  margin-top: 2rem;
}

.summary-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.summary-box h2 {
  margin: 0 0 1.5rem 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.total {
  border-top: 1px solid #eee;
  padding-top: 1rem;
  font-weight: bold;
}

.TVA {
  font-size: 0.8rem;
  color: #666;
  font-weight: normal;
  margin-left: 1rem;
}

.checkout-btn {
  width: 100%;
  background: #000;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1.5rem;
  cursor: pointer;
  font-weight: 500;
}

.points-info {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #666;
}

@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .cart-header {
    display: none;
  }

  .product-info {
    flex-direction: column;
    text-align: center;
  }

  .quantity-controls {
    justify-content: center;
  }

  .subtotal {
    justify-content: center;
  }
}
</style>
