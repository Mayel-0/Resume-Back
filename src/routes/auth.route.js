import { Router } from "express";
import { login, logout } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/login", loginRateLimit, login);
router.post("/logout", logout);

router.get("/me", verifyToken, (req, res) => {
  res.status(200).json({ id: req.admin.id, email: req.admin.email });
});

export default router;
