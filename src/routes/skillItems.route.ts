import { Router } from "express";
import { getAllSkillItems } from "../controllers/skillItems.controller.js";

const router = Router();

router.get("/skill-items", getAllSkillItems);

export default router;
