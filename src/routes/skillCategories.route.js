import { Router } from "express";
import { getAllSkillCategories } from "../controllers/skillCategories.controller.js";

const router = Router();

router.get("/skill-categories", getAllSkillCategories);

export default router;
