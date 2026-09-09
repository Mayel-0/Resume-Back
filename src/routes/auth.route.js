import { Router } from "express";
import { login, logout, verifyOtp } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import rateLimit from "express-rate-limit";

const router = Router();

const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Trop de tentatives. Réessayez dans 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/login", loginRateLimit, login);
router.post("/verify-otp", loginRateLimit, verifyOtp);
router.post("/logout", logout);

router.get("/me", verifyToken, (req, res) => {
  res.status(200).json({ id: req.admin.id, email: req.admin.email });
});

export default router;
