import dotenv from 'dotenv';
import express from 'express';
dotenv.config();
import pharmacieRoutes from './routes/pharmacie_route'


const app = express();

const PORT = process.env.PORT || 3000;


// limit :10mb Augmente la limite pour supporter tes fichiers de pharmacies complets
app.use(express.json({ limit: '10mb' }));

// Association des routes globales de l'API

app.use('/api/pharmacies', pharmacieRoutes);


// Route de base Health check
app.get('/api/health', (req, res) => {
    res.json({ status: "OK", message: "L'architecture modulaire fonctionne." });
});

//Server running
app.listen(PORT, () => {
    console.log(`[TypeScript Modulaire] Serveur actif sur : http://localhost:${PORT}`);

});