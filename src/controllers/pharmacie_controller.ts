import { Request, Response } from "express";
import prisma from '../config/prisma';
import { PharmacieProximite } from "../interfaces/pharmacie_interface";
import { Prisma } from "../generated/prisma/client";



export const getPharmaciesNearby = async (req: Request, res: Response) => {
    try {


        // 1. On extrait et on affiche dans le terminal pour VÉRIFIER ce qui arrive
    console.log("=== NOUVELLE REQUÊTE REÇUE ===");
    console.log("Query Params bruts :", req.query);

        const lat = parseFloat(req.query.lat as string);
        const lng = parseFloat(req.query.lng as string);
        const group = parseFloat(req.query.groupe as string);

    console.log(`Valeurs converties -> Lat: ${lat}, Lng: ${lng}, Groupe: ${group}`);

        if (isNaN(lat) || isNaN(lng) || isNaN(group)) {
            return res.status(400).json({
                success: false,
                error: "Paramètres invalides ou manquants (lat, lng, groupe requis).",
            });
        }

        // Requête SQL native exécutée via Prisma
        const pharmacies = await prisma.$queryRaw<PharmacieProximite[]>`
                SELECT id, nom, telephone, secteur, description_localisation as description, latitude, longitude,
                        (point(longitude, latitude) <-> point(${lng}, ${lat})) * 111.325 AS "distanceKm"
                FROM pharmacies
                WHERE groupe_garde = ${group}
                ORDER BY point(longitude, latitude) <-> point(${lng}, ${lat}) ASC
                LIMIT 10;
                `;
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