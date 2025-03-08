const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuration MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'restaurant_db'
});

// Test de connexion
connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à MySQL:', err);
    return;
  }
  console.log('Connecté à MySQL');
});

// Routes pour les produits
// app.get('/api/products', (req, res) => {
//   connection.query('SELECT * FROM products', (err, results) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//       return;
//     }
//     console.log(results);
    
//     res.json(results);
//   });
// });


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
// app.get('/api/orders', (req, res) => {
//   connection.query('SELECT * FROM orders', (err, results) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//       return;
//     }
//     res.json(results);
//   });
// });


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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});



// pour les categories 

app.get('/api/categories', (req, res) => {
  connection.query('SELECT * FROM categories', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

