// import express from 'express';
// import mysql from 'mysql2';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import bodyParser from 'body-parser';

// dotenv.config();

// const app = express();

// // Utilisation de CORS pour autoriser les requêtes venant de n'importe quelle origine
// app.use(cors());

// // Utilisation de body-parser pour parser les requêtes JSON
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Configuration MySQL avec variables d'environnement
// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME
// });

// // Test de connexion à MySQL
// connection.connect((err) => {
//   if (err) {
//     console.error('Erreur de connexion à MySQL:', err);
//     return;
//   }
//   console.log('Connecté à MySQL');
// });

// // Routes pour les produits
// app.get('/api/products', (req, res) => {
//   connection.query(
//     'SELECT id, name, description, price, category_id, image_url FROM products',
//     (err, results) => {
//       if (err) {
//         res.status(500).json({ error: err.message });
//         return;
//       }
//       res.json(results);
//     }
//   );
// });

// app.post('/api/products', (req, res) => {
//   const { name, description, price, image_url, category_id } = req.body;
//   connection.query(
//     'INSERT INTO products (name, description, price, image_url, category_id) VALUES (?, ?, ?, ?, ?)',
//     [name, description, price, image_url, category_id],
//     (err, results) => {
//       if (err) {
//         res.status(500).json({ error: err.message });
//         return;
//       }
//       res.status(201).json({ id: results.insertId });
//     }
//   );
// });

// // Routes pour les commandes
// app.post('/api/orders', (req, res) => {
//   const { total_amount, vat_amount, items } = req.body;
  
//   connection.beginTransaction(err => {  
//     if (err) { throw err; }
  
//     connection.query(
//       'INSERT INTO orders (total_amount, vat_amount) VALUES (?, ?)',
//       [total_amount, vat_amount],
//       (err, result) => {
//         if (err) {
//           return connection.rollback(() => {
//             throw err;
//           });
//         }
        
//         const orderId = result.insertId;
        
//         // Insérer les items de la commande
//         const orderItems = items.map(item => [
//           orderId,
//           item.product_id,
//           item.quantity,
//           item.unit_price,
//           item.quantity * item.unit_price
//         ]);
        
//         connection.query(
//           'INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES ?',
//           [orderItems],
//           (err) => {
//             if (err) {
//               return connection.rollback(() => {
//                 throw err;
//               });
//             }
            
//             connection.commit(err => {
//               if (err) {
//                 return connection.rollback(() => {
//                   throw err;
//                 });
//               }
//               res.status(201).json({ orderId });
//             });
//           }
//         );
//       }
//     );
//   });
// });

// // Route pour récupérer les commandes
// app.get('/api/orders', (req, res) => {
//   connection.query(
//     'SELECT id, total_amount, vat_amount, status, DATE_FORMAT(created_at, "%Y-%m-%d %H:%i:%s") as created_at FROM orders',
//     (err, results) => {
//       if (err) {
//         console.error('Erreur lors de la récupération des commandes:', err);
//         return res.status(500).json({ error: err.message });
//       }
//       res.json(results);
//     }
//   );
// });

// // Route pour mettre à jour le statut d'une commande
// app.put('/api/orders/:orderId/status', (req, res) => {
//   const { orderId } = req.params;
//   const { status } = req.body;

//   connection.query(
//     'UPDATE orders SET status = ? WHERE id = ?',
//     [status, orderId],
//     (err, results) => {
//       if (err) {
//         res.status(500).json({ error: err.message });
//         return;
//       }
//       res.json({ message: 'Statut de la commande mis à jour' });
//     }
//   );
// });

// // Route pour récupérer les catégories
// app.get('/api/categories', (req, res) => {
//   connection.query('SELECT * FROM categories', (err, results) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//       return;
//     }
//     res.json(results);
//   });
// });

// // Lancement du serveur
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Serveur démarré sur le port ${PORT}`);
// });



import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();

// Utilisation de CORS pour autoriser les requêtes venant de n'importe quelle origine
app.use(cors());

// Utilisation de body-parser pour parser les requêtes JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connexion à MongoDB
let db;
const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// async function connectToDatabase() {
//   try {
//     await client.connect();
//     db = client.db(process.env.DB_NAME);
//     console.log('Connecté à MongoDB');
//   } catch (err) {
//     console.error('Erreur de connexion à MongoDB:', err);
//   }
// }

// connectToDatabase();


async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db(process.env.DB_NAME);
    console.log('Connecté à MongoDB');
  } catch (err) {
    console.error('Erreur de connexion à MongoDB:', err);
    process.exit(1); // Arrête le processus si la connexion échoue
  }
}



// Routes pour les produits
// app.get('/api/products', async (req, res) => {
//   try {
//     const products = await db.collection('products').find({}).toArray();
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.get('/api/products', async (req, res) => {
//   try {
//     console.log('Tentative de récupération des produits...');
//     const products = await db.collection('products').find({}).toArray();
//     console.log('Produits trouvés:', products); // Pour debug
//     res.json(products);
//   } catch (err) {
//     console.error('Erreur détaillée:', err);
//     res.status(500).json({ error: err.message });
//   }
// });

app.get('/api/products', async (req, res) => {
  try {
    console.log('Tentative de récupération des produits...');
    console.log('Base de données utilisée:', db.databaseName); // Log pour vérifier le nom de la base de données
    const products = await db.collection('products').find({}).toArray();
    console.log('Produits trouvés:', products);
    res.json(products);
  } catch (err) {
    console.error('Erreur détaillée:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, description, price, image_url, category_id } = req.body;
    const result = await db.collection('products').insertOne({ name, description, price, image_url, category_id });
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Routes pour les commandes
app.post('/api/orders', async (req, res) => {
  const session = client.startSession();
  try {
    session.startTransaction();

    const { total_amount, vat_amount, items } = req.body;
    const orderResult = await db.collection('orders').insertOne({ total_amount, vat_amount, status: 'pending' }, { session });

    const orderId = orderResult.insertedId;

    const orderItems = items.map(item => ({
      order_id: orderId,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.quantity * item.unit_price
    }));

    await db.collection('order_items').insertMany(orderItems, { session });

    await session.commitTransaction();
    res.status(201).json({ orderId });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ error: err.message });
  } finally {
    session.endSession();
  }
});

// Route pour récupérer les commandes
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await db.collection('orders').find({}).toArray();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route pour mettre à jour le statut d'une commande
app.put('/api/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    await db.collection('orders').updateOne({ _id: new ObjectId(orderId) }, { $set: { status } });
    res.json({ message: 'Statut de la commande mis à jour' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route pour récupérer les catégories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await db.collection('categories').find({}).toArray();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lancement du serveur
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Serveur démarré sur le port ${PORT}`);
// });


async function startServer() {
  await connectToDatabase(); // Attendre que la connexion à la base de données soit établie
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
}

startServer();