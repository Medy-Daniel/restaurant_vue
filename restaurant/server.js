// server.js

// Importations
import express from 'express';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb'; // Ajout de ServerApiVersion
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'; // <-- NOUVEAU: Importation de 'path'


// NOUVEAU: Importations pour gérer __dirname dans un module ES
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Définition de __dirname pour les modules ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

// --- Middlewares ---
// Utilisation de CORS pour autoriser les requêtes venant de n'importe quelle origine
app.use(cors());

// Utilisation des middlewares d'Express pour parser les requêtes JSON et URL-encoded
// Ces modules remplacent body-parser dans les versions modernes d'Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à MongoDB
let db;
// Utilisation de ServerApiVersion.v1 pour la compatibilité avec les nouvelles versions de MongoDB Atlas
const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function connectToDatabase() {
    try {
        await client.connect();
        db = client.db(process.env.DB_NAME);
        console.log('Connecté à MongoDB');
        console.log('Base de données utilisée:', db.databaseName); // Log pour vérifier le nom de la base de données
    } catch (err) {
        console.error('Erreur de connexion à MongoDB:', err);
        process.exit(1); // Arrête le processus si la connexion échoue
    }
}

// --- Définition des routes API ---

// Route pour récupérer les produits
app.get('/api/products', async (req, res) => {
    try {
        console.log('Tentative de récupération des produits...');
        // Assurez-vous que db est défini avant d'appeler .collection
        if (!db) {
            console.error('La connexion à la base de données n\'est pas établie.');
            return res.status(500).json({ error: 'Database connection not established.' });
        }
        console.log('Base de données utilisée (dans la route):', db.databaseName);
        const products = await db.collection('products').find({}).toArray();
        console.log('Produits trouvés:', products);
        res.json(products);
    } catch (err) {
        console.error('Erreur détaillée lors de la récupération des produits:', err);
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
// app.put('/api/orders/:orderId/status', async (req, res) => {
//     try {
//         const { orderId } = req.params;
//         const { status } = req.body;
//         await db.collection('orders').updateOne({ _id: new ObjectId(orderId) }, { $set: { status } });
//         res.json({ message: 'Statut de la commande mis à jour' });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// Route pour récupérer les catégories
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await db.collection('categories').find({}).toArray();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- NOUVEAU: Configuration pour servir les fichiers statiques du frontend en production ---
// Ceci doit être placé APRÈS toutes vos routes API
// car si une route API correspond à l'URL, elle doit être traitée en premier.
app.use(express.static(path.join(__dirname, 'dist')));

// Pour toutes les requêtes qui ne correspondent à aucune route API,
// renvoyer l'index.html de l'application frontend.
// C'est essentiel pour le routage côté client des Single Page Applications (SPA) comme Vue.js.
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});


async function startServer() {
    await connectToDatabase(); // Attendre que la connexion à la base de données soit établie
    const PORT = process.env.PORT || 3000; // Render utilisera process.env.PORT
    app.listen(PORT, () => {
        console.log(`Serveur démarré sur le port ${PORT}`);
    });
}

startServer();