<template>
  <div class="admin-orders">
    <h1>Gestion des Commandes</h1>

    <div v-if="orders.length === 0" class="no-orders">
      Aucune commande en cours
    </div>

    <div v-else class="order-list">
      <div v-for="order in orders" :key="order.id" class="order-item">
        <h2>Commande n°{{ order.id }}</h2>
        <p class="order-date">{{ formatDate(order.created_at) }}</p>
        <div class="order-details">
          <div class="items-list">
            <ul>
              <li v-for="item in order.items" :key="item.id">
                {{ item.name }} - Quantité : {{ item.quantity }} -
                {{ (item.price * item.quantity).toFixed(2) }} €
              </li>
            </ul>
            <p class="order-total">Total : {{ order.total_amount }} €</p>
          </div>
          <div class="order-status">
            <span :class="['status-badge', order.status.toLowerCase()]">
              {{ order.status }}
            </span>
            <button
              @click="markOrderReady(order.id)"
              :disabled="order.status === 'Prête'"
              class="status-button"
            >
              {{
                order.status === "Prête" ? "Terminée" : "Marquer comme prête"
              }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { api } from "../services/api";

export default {
  name: "AdminOrdersPage",
  setup() {
    const orders = ref([]);

    const fetchOrders = async () => {
      try {
        const response = await api.getOrders();
        // console.log(response);
        
        orders.value = response;
      } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
      }
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "full",
        timeStyle: "short",
      }).format(date);
    };


//     const formatDate = (dateString) => {
//   if (!dateString) {
//     console.error("Date invalide reçue:", dateString);
//     return "Date invalide";
//   }

//   const date = new Date(dateString);
//   if (isNaN(date.getTime())) {
//     console.error("Date invalide après conversion:", dateString);
//     return "Date invalide";
//   }

//   return new Intl.DateTimeFormat("fr-FR", {
//     dateStyle: "full",
//     timeStyle: "short",
//   }).format(date);
// };


    const markOrderReady = async (orderId) => {
      try {
        await api.updateOrderStatus(orderId, "Prête");
        // Recharge les commandes pour mettre à jour l'affichage
        fetchOrders();
      } catch (error) {
        console.error('Erreur lors de la mise à jour du statut de la commande:', error);
      }
    };

    onMounted(fetchOrders);

    return {
      orders,
      formatDate,
      markOrderReady,
    };
  },
};
</script>



<style scoped>
.admin-orders {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  margin-bottom: 2rem;
  text-align: center;
}

.no-orders {
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  color: #6c757d;
}

.order-item {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.order-date {
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0.5rem 0;
}

.order-details {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.items-list {
  flex: 1;
}

.items-list ul {
  list-style: none;
  padding: 0;
}

.items-list li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.order-total {
  font-weight: bold;
  margin-top: 1rem;
}

.order-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.status-badge.en-cours {
  background: #fff3cd;
  color: #856404;
}

.status-badge.prête {
  background: #d4edda;
  color: #155724;
}

.status-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: #28a745;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.status-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.status-button:hover:not(:disabled) {
  background: #218838;
}

@media (max-width: 768px) {
  .order-details {
    flex-direction: column;
    gap: 1rem;
  }

  .order-status {
    align-items: flex-start;
  }
}
</style>
