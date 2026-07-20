import { Router } from "express";

import { getPharmaciesNearby } from "../controllers/pharmacie.controller";
import { latLngValidator } from "../middlewares/validation";
import { bulkInsertPharmacies } from "../controllers/bulkInsert_pharmacies.controller";
import { insertPharmacy } from "../controllers/insert_pharmacy.controller";
import { patchPharmacy, updatePharmacy } from "../controllers/update_pharmacy.controller";
import { deletePharmacy } from "../controllers/delete_pharmacy.controller";


const router = Router();


// Route : /api/pharmacies/proximite
router.get('/proximite', latLngValidator, getPharmaciesNearby);

//route insertion de masse de pharmacies
router.post('/bulk-insert', bulkInsertPharmacies);


router.post('/', insertPharmacy); //insert ONE Pharmacy
//router.put('/:id', updatePharmacy); //update ONE Pharmacy
router.patch('/:id', patchPharmacy); //update ONE Pharmacy
router.delete('/:id', deletePharmacy); //delete ONE Pharmacy

export default router;