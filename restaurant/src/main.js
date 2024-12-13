import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import HomePage from './components/HomePage.vue'
import MenuPage from './components/MenuPage.vue'
import CartPage from './components/CartPage.vue'
import AdminOrdersPage from './components/AdminOrdersPage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/menu', component: MenuPage },
  { path: '/cart', component: CartPage },
  { path: '/admin/orders', component: AdminOrdersPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')