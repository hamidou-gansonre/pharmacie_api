import { Request, Response } from 'express';
import { PharmacyJsonInput } from '../interfaces/pharmacie_interface';
import prisma from '../config/prisma';
import { parseCoordinate, parsedGroup, sanitizeText, toPharmacyRecord } from '../utils/pharmacy.utils';
import { validatePharmacyBatch } from '../utils/pharmacy.validator';


// const toPharmacyRecord = (pharmacy: PharmacyJsonInput) => ({
//     nom: sanitizeText(pharmacy.name, 150),
//     telephone: sanitizeText(pharmacy.phone ?? '', 20),
//     description: pharmacy.address?.trim() || null,
//     ville: pharmacy.ville?.trim(),
//     latitude: parseCoordinate(pharmacy.lat),
//     longitude: parseCoordinate(pharmacy.lng),
//     groupeGarde: parsedGroup(pharmacy.group),

// });

export const bulkInsertPharmacies = async (req: Request, res: Response): Promise<Response> => {

    const validation = validatePharmacyBatch(req.body);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.error });
    }

    const pharmaciesList = req.body as PharmacyJsonInput[];

    try {
        console.log(`[Bulk Import] Mapping de ${pharmaciesList.length} pharmacies...`);

        const formattedPharmacies = pharmaciesList.map(toPharmacyRecord);

        //inserter les pharmacies dans la base de données
        const result = await prisma.pharmacie.createMany({
            data: formattedPharmacies,
            skipDuplicates: true, // Skip duplicates based on unique constraints
        });

        return res.status(201).json({
            message: 'Importation réussie !',
            countInserted: result.count,
            totalReceived: pharmaciesList.length,
        });

    } catch (error: any) {
        console.error("[Bulk Import Error] :", error);
        return res.status(500).json({
            message: 'Error occurred while inserting pharmacies',
            details: error.message || error.toString()
        });
    }
}