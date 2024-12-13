import HomePage from '../components/HomePage.vue';
import MenuPage from '../components/MenuPage.vue';
import CartPage from '../components/CartPage.vue';
import AdminOrdersPage from '../components/AdminOrdersPage.vue';

export const routes = [
  { path: '/', component: HomePage },
  { path: '/menu', component: MenuPage },
  { path: '/cart', component: CartPage },
  { path: '/admin/orders', component: AdminOrdersPage }
]

