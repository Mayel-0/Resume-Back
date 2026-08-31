import { Router } from "express";
import { getAllSections } from "../controllers/sections.controller.js";

const router = Router();

router.get("/sections", getAllSections);

export default router;
