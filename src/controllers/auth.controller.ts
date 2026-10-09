import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import type { CookieOptions, RequestHandler } from "express";
import { db } from "../db/index.js";
import { admins, otpCodes } from "../db/schema.js";
import { eq, and, gt } from "drizzle-orm";
import { env } from "../env.js";
import { sendError } from "../lib/http.js";
import { sendOtpEmail } from "../lib/mailer.js";
import { loginSchema, verifyOtpSchema, type AdminTokenPayload } from "../models/index.js";

// Mêmes options à la pose et à la suppression, sinon le navigateur
// ne retrouve pas le cookie à effacer.
const sessionCookie: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  domain: ".mael-llado.com",
};

export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const adminList = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email));
    const admin = adminList[0];

    if (!admin) {
      res.status(401).json({ error: "Email ou mot de passe incorrect" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Email ou mot de passe incorrect" });
      return;
    }

    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Invalider les anciens codes non utilisés
    await db.delete(otpCodes).where(eq(otpCodes.email, email));

    // Stocker le nouveau code
    await db.insert(otpCodes).values({ email, code, expiresAt });

    // Envoyer l'email
    await sendOtpEmail(email, code);

    res.status(200).json({ message: "Code envoyé sur votre email." });
  } catch (error) {
    sendError(res, error, "Erreur lors de la connexion");
  }
};

export const verifyOtp: RequestHandler = async (req, res) => {
  try {
    const { email, code } = verifyOtpSchema.parse(req.body);
    const now = new Date();

    const otpList = await db
      .select()
      .from(otpCodes)
      .where(
        and(
          eq(otpCodes.email, email),
          eq(otpCodes.code, code),
          eq(otpCodes.used, false),
          gt(otpCodes.expiresAt, now),
        ),
      );

    const otp = otpList[0];

    if (!otp) {
      res.status(401).json({ error: "Code invalide ou expiré." });
      return;
    }

    await db
      .update(otpCodes)
      .set({ used: true })
      .where(eq(otpCodes.id, otp.id));

    const adminList = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email));
    const admin = adminList[0];

    if (!admin) {
      res.status(401).json({ error: "Code invalide ou expiré." });
      return;
    }

    const payload: AdminTokenPayload = { id: admin.id, email: admin.email };
    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, { ...sessionCookie, maxAge: 60 * 60 * 1000 });

    res.status(200).json({ message: "Connexion réussie !" });
  } catch (error) {
    sendError(res, error, "Erreur lors de la vérification");
  }
};

export const logout: RequestHandler = (_req, res) => {
  res.clearCookie("token", sessionCookie);
  res.status(200).json({ message: "Déconnecté" });
};
