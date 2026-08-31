import { Router } from "express";
import { getAllProjectTags } from "../controllers/projectTags.controller.js";

const router = Router();

router.get("/project-tags", getAllProjectTags);

export default router;
