import { ref, computed } from 'vue'

export const cartStore = {
  cart: ref([]),
  orders: ref([]),

  addToCart(dish) {
    const existingDish = this.cart.value.find(item => item.id === dish.id)
    if (existingDish) {
      existingDish.quantity = (existingDish.quantity || 1) + 1
    } else {
      this.cart.value.push({ ...dish, quantity: 1 })
    }
  },

  removeFromCart(dishId) {
    const index = this.cart.value.findIndex(item => item.id === dishId)
    if (index !== -1) {
      this.cart.value.splice(index, 1)
    }
  },

  clearCart() {
    this.cart.value = []
  },

  totalPrice: computed(() => 
    this.cart.value.reduce((total, item) => 
      total + (item.price * (item.quantity || 1)), 0)
  )
}