"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.latLngValidator = void 0;
const latLngValidator = (req, res, next) => {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    if (!isNaN(lat) && !isNaN(lng)) {
        // Vérification rapide des limites géographiques approximatives du Burkina Faso
        if (lat < 9 || lat > 16 || lng < -6 || lng > 3) {
            return res.status(400).json({
                success: false,
                error: "Les coordonnées GPS fournies sont en dehors des frontières autorisées."
            });
        }
    }
    return next();
};
exports.latLngValidator = latLngValidator;
