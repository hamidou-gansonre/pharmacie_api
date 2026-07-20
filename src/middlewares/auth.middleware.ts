import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';


export interface AuthRequest extends Request {
    user?: {
        id: number;
        role: 'admin' | 'moderateur';
    };
}

//Token verification
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            success: false,
            error: 'Token manquant ou invalide',
        });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            id: number;
            role: 'admin' | 'moderateur';
        };
        req.user = decoded;
        next();

    } catch (error) {
        res.status(401).json({ success: false, error: 'Token expiré ou invalide' });
    }
}

//Admin uniquement
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user?.role !== 'admin') {
        res.status(403).json({ success: false, error: 'Accès réservé aux administrateurs' });
        return;
    }
    next();
};

// Admin ou modérateur
export const requireAdminOrModerator = (req: AuthRequest, res: Response, next: NextFunction): void => {

    const role = req.user?.role;
    if (role !== 'admin' && role !== 'moderateur') {
        res.status(403).json({
            success: false,
            error: 'Accès non autorisé'
        });
        return;
    }
    next();
}