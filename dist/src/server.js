"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
const pharmacie_route_1 = __importDefault(require("./routes/pharmacie_route"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
// Association des routes globales de l'API
app.use('/api/pharmacies', pharmacie_route_1.default);
// Route de base Health check
app.get('/api/health', (req, res) => {
    res.json({ status: "OK", message: "L'architecture modulaire fonctionne." });
});
//Server running
app.listen(PORT, () => {
    console.log(`[TypeScript Modulaire] Serveur actif sur : http://localhost:${PORT}`);
});
