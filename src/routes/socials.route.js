import { Router } from "express";
import { getAllSocials } from "../controllers/socials.controller.js";

const router = Router();

router.get("/socials", getAllSocials);

export default router;
