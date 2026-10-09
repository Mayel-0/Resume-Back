import { Router } from "express";
import { getAllTimeline } from "../controllers/timeline.controller.js";

const router = Router();

router.get("/timeline", getAllTimeline);

export default router;
