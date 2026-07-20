import { Request, Response } from "express";
import prisma from "../config/prisma";

export const deletePharmacy = async (req: Request, res: Response): Promise<Response> => {

    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            error: "Pharmacy ID invalide"
        });
    }


    try {

        //suppression direct de la pharmacie
        await prisma.pharmacie.delete({ where: { id } },);

        // 204 : succès sans contenu
        return res.status(204).send();

    } catch (error: any) {
        // 4. Pharmacie introuvable
        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                error: `Pharmacie avec l'id ${id} introuvable`,
            });
        }

        console.error('[deletePharmacy Error]:', error);
        return res.status(500).json({
            success: false,
            error: 'Une erreur interne est survenue'
        });
    }
}