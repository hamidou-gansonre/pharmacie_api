import { Request, Response } from 'express';
import { AuthRequest } from "../middlewares/auth.middleware";
import bcrypt from 'bcryptjs';
import prisma from '../config/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
export const register = async (req: AuthRequest, res: Response): Promise<Response> => {
    const { email, password, role } = req.body;

    //Validation des champs
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: 'Email et mot de passe requis'
        });
    }

    if (typeof password !== 'string' || password.length < 8) {
        return res.status(400).json({
            success: false,
            error: 'Le mot de passe doit contenir au moins 8 caractères'
        });
    }


    // Validation du rôle demandé
    const requestedRole = role ?? 'moderateur';

    if (!['admin', 'moderateur'].includes(requestedRole)) {
        return res.status(400).json({
            success: false,
            error: 'Rôle invalide'
        });
    }

    //Seul un admin peut créer un admin
    if (requestedRole === 'admin' && req.user?.role !== 'admin') {
        return res.status(403).json({
            success: false,
            error: 'Seul un administrateur peut créer un autre administrateur'
        });
    }

    try {

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: requestedRole
            },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        return res.status(201).json({ success: true, data: user });

    } catch (error: unknown) {
        if (typeof error === 'object' && error !== null &&
            'code' in error && (error as { code: string }).code === 'P2002') {
            return res.status(409).json({
                success: false,
                error: 'Un compte avec cet email existe déja'
            });

        }

        console.error('[Register Error]:', error);
        return res.status(500).json({
            success: false,
            error: 'Une erreur interne est survenue'
        });
    }


};

export const login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    //validation
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: 'Email et mot de passe requis',
        });
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({
            success: false,
            error: 'Email et mot de passe invalides',
        });
    }

    try {

        //Chercher le user
        const user = await prisma.user.findUnique({
            where: { email: email.toLocaleLowerCase().trim() },
            select: {
                id: true,
                email: true,
                password: true,  // nécessaire pour bcrypt.compare
                role: true,
            },
        });

        //Message identique - on ne relève pas lequel est faux
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Identifiants invalides',
            });
        }

        //Vérification du mot de passe
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                error: 'Identifiants invalides',
            });
        }

        // Génération du token avec id et role réels depuis la base
        const jwtOptions: SignOptions = {
            expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as SignOptions['expiresIn'],
        }
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET as string,
            jwtOptions
        );

        //On retourne le token ans le mot de passe
        return res.status(200).json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            }
        });

    } catch (error: unknown) {
        console.error('[login Error]:', error);
        return res.status(500).json({
            success: false,
            error: 'Une erreur interne est survenue',
        });
    }
};