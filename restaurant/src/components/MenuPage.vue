<template>
  <div class="menu-page">
    <div class="menu-header">
      <h1 class="title">Notre Menu</h1>
      <div class="underline"></div>
    </div>

    <div class="dishes">
      <div v-for="dish in menu" :key="dish.id" class="dish-wrapper">
        <div class="dish-card">
          <div class="dish-image-container">
            <img :src="dish.image" :alt="dish.name" class="dish-image" />
            <div class="dish-overlay">
              <button class="quick-view-btn" @click="openQuickView(dish)">
                Aperçu rapide
              </button>
            </div>
          </div>
          <div class="dish-info">
            <h3 class="dish-title">{{ dish.name }}</h3>
            <p class="dish-description">{{ dish.description }}</p>
            <div class="dish-footer">
              <span class="dish-price">{{ dish.price.toFixed(2) }} €</span>
              <button class="add-to-cart-btn" @click="handleAddToCart(dish)">
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick View Modal -->
    <div v-if="selectedDish" class="modal" @click="selectedDish = null">
      <div class="modal-content" @click.stop>
        <button class="close-modal" @click="selectedDish = null">
          &times;
        </button>
        <div class="modal-image">
          <img :src="selectedDish.image" :alt="selectedDish.name" />
        </div>
        <div class="modal-info">
          <h2>{{ selectedDish.name }}</h2>
          <p>{{ selectedDish.description }}</p>
          <div class="modal-footer">
            <span class="modal-price"
              >{{ selectedDish.price.toFixed(2) }} €</span
            >
            <button
              @click="handleAddToCart(selectedDish)"
              class="add-to-cart-btn"
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div class="toast" :class="{ 'show-toast': showToast }">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { menuService } from "../services/MenuService";
import { cartStore } from "../stores/CartStore";

export default {
  name: "MenuPage",
  setup() {
    const menu = ref(menuService.getMenu());
    const cart = ref(cartStore.cart);
    const selectedDish = ref(null);
    const showToast = ref(false);
    const toastMessage = ref("");

    const showNotification = (message) => {
      toastMessage.value = message;
      showToast.value = true;
      setTimeout(() => {
        showToast.value = false;
      }, 3000);
    };

    const handleAddToCart = (dish) => {
      cartStore.addToCart(dish);
      cart.value = [...cartStore.cart];
      showNotification(`${dish.name} a été ajouté au panier`);
    };

    const openQuickView = (dish) => {
      selectedDish.value = dish;
    };

    watch(cart, (newCart) => {
      console.log("Le panier a été mis à jour :", newCart);
    });

    return {
      menu,
      cart,
      handleAddToCart,
      selectedDish,
      openQuickView,
      showToast,
      toastMessage,
    };
  },
};
</script>

<style scoped>
.menu-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 2rem;
  background-color: #ffffff;
}

.menu-header {
  text-align: center;
  margin-bottom: 4rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.underline {
  width: 40px;
  height: 2px;
  background: #1a1a1a;
  margin: 0 auto;
}

.dishes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2.5rem;
  padding: 1rem;
}

.dish-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.4s ease;
  cursor: pointer;
  position: relative;
}

.dish-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.dish-image-container {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.dish-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.dish-card:hover .dish-image {
  transform: scale(1.05);
}

.dish-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.dish-card:hover .dish-overlay {
  opacity: 1;
}

.quick-view-btn {
  padding: 0.75rem 1.5rem;
  background: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transform: translateY(20px);
  transition: all 0.3s ease;
  font-weight: 500;
}

.dish-card:hover .quick-view-btn {
  transform: translateY(0);
}

.dish-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dish-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.dish-description {
  color: #666;
  line-height: 1.6;
  font-size: 0.95rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.dish-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.dish-price {
  font-size: 1.4rem;
  font-weight: 600;
  color: #1a1a1a;
}

.add-to-cart-btn {
  padding: 0.75rem 1.5rem;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-to-cart-btn:hover {
  background: #333;
  transform: translateY(-2px);
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 1000px;
  display: grid;
  grid-template-columns: 45% 55%;
  overflow: hidden;
  position: relative;
}

.modal-image {
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.modal-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-info {
  padding: 3rem;
  display: flex;
  flex-direction: column;
}

.modal-info h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #1a1a1a;
}

.modal-info p {
  font-size: 1rem;
  line-height: 1.8;
  color: #666;
  margin-bottom: 2rem;
}

.modal-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.modal-price {
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
}

.close-modal {
  position: absolute;
  right: 15px;
  top: 15px;
  width: 35px;
  height: 35px;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  z-index: 10;
}

.close-modal:hover {
  transform: rotate(360deg);
}

.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #1a1a1a;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  z-index: 1000;
}

.show-toast {
  transform: translateX(0);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .menu-page {
    padding: 2rem 1rem;
  }

  .title {
    font-size: 2rem;
  }

  .dishes {
    gap: 1.5rem;
  }

  .modal-content {
    grid-template-columns: 1fr;
  }

  .modal-image {
    min-height: 300px;
  }

  .modal-info {
    padding: 2rem;
  }

  .modal-info h2 {
    font-size: 1.5rem;
  }

  .modal-price {
    font-size: 1.5rem;
  }
}
</style>
