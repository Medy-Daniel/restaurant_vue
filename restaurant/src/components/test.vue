<template>
    <div class="menu-page">
      <div class="menu-header">
        <h1 class="title">Notre Menu</h1>
        <div class="underline"></div>
      </div>
  
      <!-- Indicateur de chargement -->
      <!-- TODO: Ajouter un indicateur visuel de chargement ici -->
  
      <!-- Message d'erreur -->
      <!-- TODO: Ajouter une section pour afficher un message d'erreur ici -->
  
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
          :key="category.id"
          @click="setFilter(category.id)"
          :class="{ active: activeFilter === category.id }"
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
      const loading = ref(true); // TODO: Ajouter une variable d'état pour le chargement
      const error = ref(null); // TODO: Ajouter une variable d'état pour les erreurs
  
      const loadMenu = async () => {
        try {
          loading.value = true;
          menu.value = await api.getProducts();
        } catch (error) {
          console.error('Erreur lors du chargement du menu:', error);
          error.value = "Erreur lors du chargement du menu.";
        } finally {
          loading.value = false;
        }
      };
  
      const loadCategories = async () => {
        try {
          loading.value = true;
          categories.value = await api.getCategories();
        } catch (error) {
          console.error('Erreur lors du chargement des catégories:', error);
          error.value = "Erreur lors du chargement des catégories.";
        } finally {
          loading.value = false;
        }
      };
  
      const filteredMenu = computed(() => {
        if(activeFilter.value === null){
            return menu.value;
        }
        return menu.value.filter(dish => dish.category_id === activeFilter.value)
      });
  
      const setFilter = (categoryId) => {
        activeFilter.value = categoryId === activeFilter.value ? null : categoryId;
      };
  
      const showNotification = (message) => {
        toastMessage.value = message;
        showToast.value = true;
        setTimeout(() => {
            showToast.value = false;
        }, 3000 )
    };
  
      const handleAddToCart = (dish) => {
        const found = cart.value.find(item => item.id === dish.id)
        if(found){
            found.quantity += 1 ;
        }else {
            cart.value.push({ ...dish, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart.value));
        showNotification(`${dish.name} a été ajouté au panier`);
      };
  
      const openQuickView = (dish) => {
        selectedDish.value = dish;
      };
  
      // TODO: Ajouter la fonction formatPrice ici

      const formatPrice = () =>{
        
      }
  
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
        loading, 
        error, 
      };
    },
  };
  </script>
  