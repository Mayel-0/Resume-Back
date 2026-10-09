import { Router } from "express";
import { getProfil } from "../controllers/profil.controller.js";

const router = Router();

router.get("/profil", getProfil);

export default router;
