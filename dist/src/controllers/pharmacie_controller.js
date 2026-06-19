"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPharmaciesNearby = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const client_1 = require("../generated/prisma/client");
const getPharmaciesNearby = async (req, res) => {
    try {
        // 1. On extrait et on affiche dans le terminal pour VÉRIFIER ce qui arrive
        console.log("=== NOUVELLE REQUÊTE REÇUE ===");
        console.log("Query Params bruts :", req.query);
        const lat = parseFloat(req.query.lat);
        const lng = parseFloat(req.query.lng);
        const group = parseFloat(req.query.groupe);
        console.log(`Valeurs converties -> Lat: ${lat}, Lng: ${lng}, Groupe: ${group}`);
        if (isNaN(lat) || isNaN(lng) || isNaN(group)) {
            return res.status(400).json({
                success: false,
                error: "Paramètres invalides ou manquants (lat, lng, groupe requis).",
            });
        }
        // Requête SQL native exécutée via Prisma
        // 2. Utilisation de Prisma.raw pour injecter proprement les nombres dans la formule
        const pharmacies = await prisma_1.default.$queryRaw(client_1.Prisma.raw(`
                SELECT id, nom, telephone, secteur, description_localisation as description, latitude, longitude,
                        (6371 * acos(
                        cos(radians(${lat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${lng})) + 
                        sin(radians(${lat})) * sin(radians(latitude))
                        )) AS "distanceKm"
                FROM pharmacies
                WHERE groupe_garde = ${group}
                ORDER BY "distanceKm" ASC
                LIMIT 10;
                `));
        return res.json({
            success: true,
            results: pharmacies.length,
            data: pharmacies,
        });
    }
    catch (error) {
        console.log("Erreur dans Pharmacie Controller :", error);
        return res.status(500).json({ success: false, error: "Erreur interne du serveur." });
    }
};
exports.getPharmaciesNearby = getPharmaciesNearby;
