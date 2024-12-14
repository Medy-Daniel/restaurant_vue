import { reactive } from 'vue'

export const cartStore = reactive({
  cart: [],

  addToCart(dish) {
    const found = this.cart.find((item) => item.id === dish.id)
    if (found) {
      found.quantity += 1
    } else {
      this.cart.push({ ...dish, quantity: 1 })
    }
  },

  decreaseQuantity(dishId) {
    const found = this.cart.find((item) => item.id === dishId)
    if (found) {
      found.quantity -= 1
      if (found.quantity <= 0) {
        this.removeFromCart(dishId)
      }
    }
  },

  removeFromCart(dishId) {
    this.cart = this.cart.filter((item) => item.id !== dishId)
  },

  clearCart() {
    this.cart = []
  }
})
