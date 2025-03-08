import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const api = {
  async getProducts() {
    try {
      const response = await axios.get(`${API_URL}/products`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      throw error;
    }
  },

  async createOrder(orderData) {
    try {
      const response = await axios.post(`${API_URL}/orders`, orderData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      throw error;
    }
  },

  async getOrders() {
    try {
      const response = await axios.get(`${API_URL}/orders`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      throw error;
    }
  },

  async getCategories(){
    try {
      const response = await axios.get(`${API_URL}/categories`);
      return response.data;
    }catch(error){
      console.error('Erreur lors de la récupération des categories:', error);
      throw error;
    }
  },

  async updateOrderStatus(orderId, status) {
    try {
      const response = await axios.put(`${API_URL}/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de la commande:', error);
      throw error;
    }
  }
};
