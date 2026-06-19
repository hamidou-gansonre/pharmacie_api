import { Request, Response, NextFunction } from "express";

export const latLngValidator = (req : Request, res: Response, next: NextFunction) =>{

    const lat = parseFloat(req.query.lat as string);
  const lng = parseFloat(req.query.lng as string);

  if(!isNaN(lat) && !isNaN(lng)) {

    // Vérification rapide des limites géographiques approximatives du Burkina Faso
    if (lat < 9 || lat > 16 || lng < -6 || lng > 3) {
      return res.status(400).json({
        success: false,
        error: "Les coordonnées GPS fournies sont en dehors des frontières autorisées."
      });
    }
  }

  return next();
}