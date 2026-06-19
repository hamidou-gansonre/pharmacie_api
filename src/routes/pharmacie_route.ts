import { Router } from "express";

import { getPharmaciesNearby } from "../controllers/pharmacie_controller";
import { latLngValidator } from "../middlwares/validation";


const router = Router();


// Route : /api/pharmacies/proximite
router.get('/proximite', latLngValidator,  getPharmaciesNearby);


export default router ;