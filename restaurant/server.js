import express from 'express';
import mysql from 'mysql2';
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

// Configuration MySQL avec variables d'environnement
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Test de connexion à MySQL
connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à MySQL:', err);
    return;
  }
  console.log('Connecté à MySQL');
});

// Routes pour les produits
app.get('/api/products', (req, res) => {
  connection.query(
    'SELECT id, name, description, price, category_id, image_url FROM products',
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(results);
    }
  );
});

app.post('/api/products', (req, res) => {
  const { name, description, price, image_url, category_id } = req.body;
  connection.query(
    'INSERT INTO products (name, description, price, image_url, category_id) VALUES (?, ?, ?, ?, ?)',
    [name, description, price, image_url, category_id],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: results.insertId });
    }
  );
});

// Routes pour les commandes
app.post('/api/orders', (req, res) => {
  const { total_amount, vat_amount, items } = req.body;
  
  connection.beginTransaction(err => {  
    if (err) { throw err; }
  
    connection.query(
      'INSERT INTO orders (total_amount, vat_amount) VALUES (?, ?)',
      [total_amount, vat_amount],
      (err, result) => {
        if (err) {
          return connection.rollback(() => {
            throw err;
          });
        }
        
        const orderId = result.insertId;
        
        // Insérer les items de la commande
        const orderItems = items.map(item => [
          orderId,
          item.product_id,
          item.quantity,
          item.unit_price,
          item.quantity * item.unit_price
        ]);
        
        connection.query(
          'INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) VALUES ?',
          [orderItems],
          (err) => {
            if (err) {
              return connection.rollback(() => {
                throw err;
              });
            }
            
            connection.commit(err => {
              if (err) {
                return connection.rollback(() => {
                  throw err;
                });
              }
              res.status(201).json({ orderId });
            });
          }
        );
      }
    );
  });
});

// Route pour récupérer les commandes
app.get('/api/orders', (req, res) => {
  connection.query(
    'SELECT id, total_amount, vat_amount, status, DATE_FORMAT(created_at, "%Y-%m-%d %H:%i:%s") as created_at FROM orders',
    (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération des commandes:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    }
  );
});

// Route pour mettre à jour le statut d'une commande
app.put('/api/orders/:orderId/status', (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  connection.query(
    'UPDATE orders SET status = ? WHERE id = ?',
    [status, orderId],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Statut de la commande mis à jour' });
    }
  );
});

// Route pour récupérer les catégories
app.get('/api/categories', (req, res) => {
  connection.query('SELECT * FROM categories', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
