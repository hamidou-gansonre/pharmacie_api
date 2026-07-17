import { Request, Response } from "express";
import prisma from '../config/prisma';
import { PharmacieProximite } from "../interfaces/pharmacie_interface";
import { Prisma } from "../generated/prisma/client";
import { CONFIG_GARDES } from "../utils/group_garde.utils";
import { getPharmacyTimeStatus } from "../utils/Work_hours.utils";
import { parseCoordinateOrNull } from "../utils/pharmacy.utils";


export const getPharmaciesNearby = async (req: Request, res: Response) => {
    try {


        // 1. On extrait et on affiche dans le terminal pour VÉRIFIER ce qui arrive
        console.log("=== NOUVELLE REQUÊTE REÇUE ===");
        console.log("Query Params bruts :", req.query);

        const lat = parseCoordinateOrNull(req.query.lat);
        const lng = parseCoordinateOrNull(req.query.lng);
        const radius = req.query.radius;
        const lightMode = req.query.lightMode;
        //const group = parseFloat(req.query.groupe as string);

        console.log(`Status LightMode : ${lightMode} , Distance Radius : ${radius} AND Valeurs converties -> Lat: ${lat}, Lng: ${lng}`);

        if (lat === null || lng === null) {
            return res.status(400).json({
                success: false,
                error: "Paramètres invalides ou manquants (lat, lng requis).",
            });
        }

        // Rayon dynamique : prend le radius du mobile, ou 5000 mètres (5km) par défaut
        const searchRadius = radius ? parseFloat(radius as string) : 5000;
        // Mode léger dynamique : vérifie si le string vaut "true"
        const isLightMode = lightMode === 'true';

        // 2. Configuration dynamique du SELECT de Prisma (Le cœur du Lazy Loading)
        // Si la connexion est lente (lightMode = true), on ne sélectionne que l'essentiel pour la carte
        // 1. On définit les colonnes dynamiquement pour le haut du SELECT
        const selectColumns = isLightMode
            ? Prisma.raw('id, nom, latitude, longitude') // Mode léger (Réseau lent)
            : Prisma.raw('id, nom, telephone, ville, description_localisation as description, latitude, longitude');


        //Obtenir l'heure actuelle local (GMT)
        const now = new Date();

        // 1. Récupérer toutes les villes configurées (["OUAGADOUGOU", "BOBO_DIOULASSO", "KOUDOUGOU" ECT])
        const cityLists = Object.keys(CONFIG_GARDES);

        //2.Générer dynamiquement les fragments SQL pour chaque ville
        const sQLFragments = cityLists.map((city) => {
            const status = getPharmacyTimeStatus(now, city);
            if (status.isNormalHours) {
                // En journée : la ville entière est ouverte
                return Prisma.sql`ville = ${city}`;
            } else {
                // En garde : la ville + le groupe spécifique
                console.log(`[BACKEND TS] Mode : ${status.isNormalHours ? 'JOURNÉE' : `NUIT (Groupe ${status.activeGroup})`}`);
                return Prisma.sql`(ville = ${city} AND groupe_garde = ${status.activeGroup})`;
            }
        });


        // 3. Joindre tous les fragments avec un "OR"
        // Résultat généré : (ville = 'OUAGA' AND ...) OR (ville = 'BOBO'...) OR (ville = 'KOUDOUGOU'...
        const finalWhereClause = Prisma.join(sQLFragments, ' OR ');

        //Requête SQL native exécutée via Prisma || (${isWorkHour}::boolean = true OR groupe_garde = ${todayGroup})
        //id, nom, telephone, ville, description_localisation as description, latitude, longitude
        const pharmacies = await prisma.$queryRaw<PharmacieProximite[]>`
                SELECT ${selectColumns},
                       (point(longitude, latitude) <-> point(${lng}, ${lat})) * 111.325 AS "distanceKm"
              FROM pharmacies
             WHERE ${finalWhereClause}
           ORDER BY point(longitude, latitude) <-> point(${lng}, ${lat}) ASC
           LIMIT 20;
          `;

        // // Requête SQL native ultra-précise pour le Burkina Faso
        // const pharmacies = await prisma.$queryRaw<PharmacieProximite[]>`
        //     SELECT id, nom, telephone, secteur, description_localisation as description, latitude, longitude,
        //         (6371 * acos(
        //             cos(radians(${lat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${lng})) + 
        //             sin(radians(${lat})) * sin(radians(latitude))
        //         )) AS "distanceKm"
        //     FROM pharmacies
        //     WHERE (${isWorkHour}::boolean = true OR groupe_garde = ${todayGroup})
        //     ORDER BY "distanceKm" ASC
        //     LIMIT 20;
        // `;


        console.log(`[BACKEND TS] ${pharmacies.length} ${pharmacies.map((phar) => phar.nom).join(', ')} pharmacies trouvées à proximité de (${lat}, ${lng})`);
        return res.json({
            success: true,
            results: pharmacies.length,
            data: pharmacies,
        });

    } catch (error) {

        console.log("Erreur dans Pharmacie Controller :", error);
        return res.status(500).json({ success: false, error: "Erreur interne du serveur." });

    }
}