import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { db } from "../db/index.js";
import { admins, otpCodes } from "../db/schema.js";
import { eq, and, gt } from "drizzle-orm";
import { sendOtpEmail } from "../lib/mailer.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const adminList = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email));
    const admin = adminList[0];

    if (!admin) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
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
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la connexion" });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, code } = req.body;
  try {
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
      return res.status(401).json({ error: "Code invalide ou expiré." });
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

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      domain: ".mael-llado.com",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Connexion réussie !" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la vérification" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    domain: ".mael-llado.com",
  });
  res.status(200).json({ message: "Déconnecté" });
};
