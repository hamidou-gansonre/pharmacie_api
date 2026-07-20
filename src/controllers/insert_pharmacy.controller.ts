import { Request, Response } from "express";
import { validatePharmacyInput } from "../utils/pharmacy.validator"
import prisma from "../config/prisma";
import { PharmacyJsonInput } from "../interfaces/pharmacie_interface";
import { toPharmacyRecord } from "../utils/pharmacy.utils";



export const insertPharmacy = async (req: Request, res: Response): Promise<Response> => {


    //validation du body
    const validation = validatePharmacyInput(req.body);
    if (!validation.valid) {
        return res.status(400).json({ success: false, error: 'Une pharmacie avec ces informations existe déjà' });
    }

    try {

        //Transformation et insertion — toPharmacyRecord garantit les types

        const pharmacy = await prisma.pharmacie.create({
            data: toPharmacyRecord(req.body as PharmacyJsonInput),
        });

        // Retour de la ressource créée avec son id
        return res.status(201).json({
            success: true,
            data: pharmacy,
        });

    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(409).json({
                success: false,
                error: 'Une pharmacie avec ces informations existe déjà',
            });
        }

        console.error('[insertPharmacy Error]:', error);
        return res.status(500).json({ success: false, error: 'Une erreur interne est survenue' });
    }
}