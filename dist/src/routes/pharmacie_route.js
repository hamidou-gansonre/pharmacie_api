"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pharmacie_controller_1 = require("../controllers/pharmacie_controller");
const validation_1 = require("../middlwares/validation");
const router = (0, express_1.Router)();
// Route : /api/pharmacies/proximite
router.get('/proximite', validation_1.latLngValidator, pharmacie_controller_1.getPharmaciesNearby);
exports.default = router;
