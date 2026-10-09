import { Router } from "express";

const router = Router();

router.get("/ping", (_req, res) => {
  res.json({ success: true, message: "pong" });
});

export default router;
