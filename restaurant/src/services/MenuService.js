export const menuService = {
  getMenu() {
    return [
      { 
        id: 1, 
        name: 'Pizza Margherita', 
        description: 'Sauce tomate, mozzarella, basilic', 
        price: 12.99, 
        isNew: true 
      },
      { 
        id: 2, 
        name: 'Salade César', 
        description: 'Poulet grillé, croûtons, parmesan', 
        price: 9.99,
        isNew: false
      },
      // Autres plats...
    ]
  }
}