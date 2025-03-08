// import { reactive, ref } from 'vue'

// // Créer la référence orders en dehors du store
// const orders = ref([])

// export const cartStore = reactive({
//   cart: [],
//   orders, // Utiliser la référence directement

//   addToCart(dish) {
//     const found = this.cart.find((item) => item.id === dish.id)
//     if (found) {
//       found.quantity += 1
//     } else {
//       this.cart.push({ ...dish, quantity: 1 })
//     }
//   },

//   decreaseQuantity(dishId) {
//     const found = this.cart.find((item) => item.id === dishId)
//     if (found) {
//       found.quantity -= 1
//       if (found.quantity <= 0) {
//         this.removeFromCart(dishId)
//       }
//     }
//   },

//   removeFromCart(dishId) {
//     const index = this.cart.findIndex((item) => item.id === dishId)
//     if (index !== -1) {
//       this.cart.splice(index, 1)
//     }
//   },

//   clearCart() {
//     this.cart = []
//   },

//   addOrder(orderDetails) {
//     const order = {
//       id: Date.now(),
//       items: [...this.cart],
//       total: orderDetails.total,
//       status: 'En cours',
//       date: new Date().toISOString()
//     }
//     this.orders.push(order) // Utiliser push directement sur la référence
//     this.clearCart()
//     return order.id
//   },

//   updateOrderStatus(orderId, status) {
//     const orderIndex = this.orders.findIndex(o => o.id === orderId)
//     if (orderIndex !== -1) {
//       this.orders[orderIndex].status = status
//     }
//   }
// })