import { Router } from "express";
import { getAllProjectTechStack } from "../controllers/projectTechStack.controller.js";

const router = Router();

router.get("/project-tech-stack", getAllProjectTechStack);

export default router;
