<template>
  <div class="menu-page">
    <h2>Notre Menu</h2>
    <div class="dishes">
      <DishItem
        v-for="dish in menu"
        :key="dish.id"
        :dish="dish"
        @add-to-cart="addToCart"
      />
    </div>
  </div>
</template>


<script>
import { ref, computed } from 'vue'
import { menuService } from '../services/MenuService'
import { cartStore } from '../stores/CartStore'
import DishItem from './DishItems.vue'

export default {
  components: { DishItem },
  setup() {
    const menu = ref(menuService.getMenu())
    const cart = computed(() => cartStore.cart)

    const addToCart = (dish) => {
      cartStore.addToCart(dish)
      // TODO: Ajouter un toast de confirmation
      if (window && window.alert) {
        window.alert(`${dish.name} a été ajouté au panier`)
      }
    }

    return {
      menu,
      cart,
      addToCart
    }
  }
}
</script>

<style scoped>
.menu-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.dishes {
  display: grid;
  /* grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); */
  gap: 20px;
}
</style>