import { Request, Response } from "express";
import prisma from "../config/prisma";
import { toPharmacyRecord, toPharmacyUpdateRecord } from "../utils/pharmacy.utils";
import { PharmacyJsonInput } from "../interfaces/pharmacie_interface";
import { validatePharmacyUpdate } from "../utils/pharmacy.validator";

export const updatePharmacy = async (req: Request, res: Response): Promise<Response> => {

    //Extraction et validation de l'id
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            error: "Pharamcy ID invalide"
        });
    }

    try {

        const updated = await prisma.pharmacie.update({
            where: { id },
            data: toPharmacyRecord(req.body as PharmacyJsonInput),
        });

        return res.status(200).json({
            success: true,
            data: updated,
        });

    } catch (error: any) {
        // 4. Pharmacie introuvable — Prisma le signale via P2025
        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                error: `Pharmacie avec l'id ${id} introuvable`,
            });
        }

        console.error('[updatePharmacy Error]:', error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}


export const patchPharmacy = async (req: Request, res: Response): Promise<Response> => {

    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ success: false, error: 'ID invalide' });
    }

    const validation = validatePharmacyUpdate(req.body);
    if (!validation.valid) {
        return res.status(400).json({ success: false, error: `Pharmacie avec l'id ${id} introuvable` });
    }

    try {
        const updated = await prisma.pharmacie.update({
            where: { id },
            data: toPharmacyUpdateRecord(req.body as Partial<PharmacyJsonInput>),
        });

        return res.status(200).json({ success: true, data: updated });

    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                error: `Pharmacie avec l'id ${id} introuvable`,
            });
        }

        console.error('[patchPharmacy Error]:', error);
        return res.status(500).json({ success: false, error: 'Une erreur interne est survenue', });
    }
};