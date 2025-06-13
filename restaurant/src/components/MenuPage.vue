<template>
  <div class="menu-page">
    <div class="menu-header">
      <h1 class="title">Notre Menu</h1>
      <div class="underline"></div>
    </div>
    
<!-- bouton pour voir tous les plats  -->
    <div class="filter-buttons">
  <button
    @click="setFilter(null)"
    :class="{ active: activeFilter === null }">
    Tous
  </button>
    </div>
    <div class="filter-buttons">
      <button
        v-for="category in categories"
        :key="category._id"
        @click="setFilter(category._id)"
        :class="{ active: activeFilter === category._id }"
      >
        {{ category.name }}
      </button>
    </div>
    <div class="dishes">
      <div v-for="dish in filteredMenu" :key="dish.id" class="dish-wrapper">
        <div class="dish-card">
          <div class="dish-image-container">
            <img :src="dish.image_url" :alt="dish.name" class="dish-image" />
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
              <span class="dish-price">{{ formatPrice(dish.price) }} €</span>
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
          <img :src="selectedDish.image_url" :alt="selectedDish.name" />
        </div>
        <div class="modal-info">
          <h2>{{ selectedDish.name }}</h2>
          <p>{{ selectedDish.description }}</p>
          <div class="modal-footer">
            <span class="modal-price">{{ formatPrice(selectedDish.price) }} €</span>
            <button @click="handleAddToCart(selectedDish)" class="add-to-cart-btn">
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
import { ref, computed, onMounted } from "vue";
import { api } from "../services/api.js";

export default {
  name: "MenuPage",
  setup() {
    const menu = ref([]);
    const categories = ref([]);
    const activeFilter = ref(null);
    const cart = ref(JSON.parse(localStorage.getItem('cart')) || []);
    const selectedDish = ref(null);
    const showToast = ref(false);
    const toastMessage = ref("");

    const loadMenu = async () => {
      try {
        menu.value = await api.getProducts();
      } catch (error) {
        console.error('Erreur lors du chargement du menu:', error);
      }
    };

    const loadCategories = async () => {
      try {
        categories.value = await api.getCategories();
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
      }
    };

    const filteredMenu = computed(() => {
      if (activeFilter.value === null) {
        return menu.value;
      }
     return menu.value.filter(dish => dish.category_id === activeFilter.value);

    });

    const setFilter = (categoryId) => {
      activeFilter.value = categoryId === activeFilter.value ? null : categoryId;
    };

    const showNotification = (message) => {
      toastMessage.value = message;
      showToast.value = true;
      setTimeout(() => {
        showToast.value = false;
      }, 3000);
    };

    // const handleAddToCart = (dish) => {
    //   const found = cart.value.find((item) => item.id === dish.id);
    //   if (found) {
    //     found.quantity += 1;
    //   } else {
    //     cart.value.push({ ...dish, quantity: 1 });
    //   }
    //   localStorage.setItem('cart', JSON.stringify(cart.value));
    //   showNotification(`${dish.name} a été ajouté au panier`);
    // };

    const handleAddToCart = (dish) => {
    // IMPORTANT: Convertir l'ID du plat en string pour la comparaison
    // et s'assurer que c'est bien l'ObjectId qui est potentiellement converti.
    const dishIdString = dish._id ? dish._id.toString() : dish.id; // Utilisez _id si présent, sinon id

    const found = cart.value.find((item) => {
        // Convertir l'ID de l'item du panier en string pour la comparaison
        const itemIdString = item._id ? item._id.toString() : item.id;
        return itemIdString === dishIdString;
    });

    if (found) {
        found.quantity += 1;
    } else {
        // Si l'élément n'est pas trouvé, ajoutez-le.
        // Assurez-vous de stocker l'ID comme string dans le panier aussi pour les futures comparaisons
        cart.value.push({ ...dish, _id: dishIdString, id: dishIdString, quantity: 1 }); // Stockez _id et id comme string
    }
    localStorage.setItem('cart', JSON.stringify(cart.value));
    showNotification(`${dish.name} a été ajouté au panier`);
};

    const openQuickView = (dish) => {
      selectedDish.value = dish;
    };

    const formatPrice = (price) => {
      const numericPrice = Number(price);
      return isNaN(numericPrice) ? price : numericPrice.toFixed(2);
    };

    onMounted(() => {
      loadMenu();
      loadCategories();
    });

    return {
      menu,
      filteredMenu,
      categories,
      activeFilter,
      cart,
      handleAddToCart,
      selectedDish,
      openQuickView,
      showToast,
      toastMessage,
      formatPrice,
      setFilter,
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
  right: 0rem;
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


/* partie filter boutons  */

.filter-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .filter-buttons button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  color: #333;
}

.filter-buttons button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.filter-buttons button.active {
  background: linear-gradient(135deg, #ff3366, #dc143c);
  color: white;
  box-shadow: 
    0 4px 6px -1px rgba(220, 20, 60, 0.2),
    0 10px 15px -3px rgba(220, 20, 60, 0.1);
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
