import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
dotenv.config();
import pharmacieRoutes from './routes/pharmacie_route'
import { registerProcessHandlers } from './config/process_handler';
import prisma from './config/prisma';

const app = express();

const PORT = process.env.PORT || 3000;




// Configuration CORS selon l'environnement
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? process.env.ALLOWED_ORIGINS?.split(',') // ex: 'https://app.burkindi.com,https://admin.burkindi.com'
        : '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

const startServer = async () => {
    try {

        // ✅ Test de connexion réelle avant d'accepter des requêtes
        await prisma.$connect();
        console.log('[Database] Connection established');

        app.use(cors(corsOptions));

        // limit :10mb Augmente la limite pour supporter tes fichiers de pharmacies complets
        app.use(express.json({ limit: '10mb' }));


        // Association des routes globales de l'API

        app.use('/api/pharmacies', pharmacieRoutes);


        // Route de base Health check
        app.get('/api/health', (req, res) => {
            res.json({ status: "OK", message: "L'architecture modulaire fonctionne." });
        });

        //Server running
        const server = app.listen(PORT, () => {
            console.log(`[TypeScript Modulaire] Serveur actif sur : http://localhost:${PORT}`);

        });

        registerProcessHandlers(server);

    } catch (error) {
        console.error('[FATAL] Database connection failed:', error);
        process.exit(1); // Fail fast — le process manager relancera
    }
}

startServer();


