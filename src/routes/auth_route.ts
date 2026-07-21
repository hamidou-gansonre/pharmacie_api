import { Router } from "express";
import { login, register } from "../controllers/auth.controller";
import { authenticate, requireAdmin } from "../middlewares/auth.middleware";



const router = Router();

router.post('/login', login);
//admin only can add and admin
router.post('/register', authenticate, requireAdmin, register);

export default router;