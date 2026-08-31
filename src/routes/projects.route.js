import { Router } from "express";
import { getAllProjects } from "../controllers/projects.controller.js";

const router = Router();

router.get("/projects", getAllProjects);

export default router;
