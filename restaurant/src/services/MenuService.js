import pizza from '../assets/images/pizza.jpeg';


export const menuService = {
  getMenu() {
    return [
      {
        id: 1,
        name: 'Pizza Margherita',
        description: 'Tomates fraîches, mozzarella, basilic',
        price: 8.50,
        image: {pizza}
      },
      {
        id: 2,
        name: 'Pâtes Carbonara',
        description: 'Crème, lardons, parmesan',
        price: 9.50,
        image: 'https://via.placeholder.com/200x150?text=Salade+Cesar'
      },
      {
        id: 3,
        name: 'Salade César',
        description: 'Poulet, parmesan, croûtons',
        price: 7.50,
        image: 'https://via.placeholder.com/200x150?text=Salade+Cesar'
      }
    ]
  }
}