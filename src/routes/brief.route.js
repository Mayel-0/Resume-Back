import { Router } from "express";
import { getAllBriefs } from "../controllers/brief.controller.js";

const router = Router();

router.get("/briefs", getAllBriefs);

export default router;
