import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db/index.js";
import { admins } from "../db/schema.ts";
import { eq } from "drizzle-orm";

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
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    res.status(200).json({ token, message: "Connexion réussie !" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la connexion" });
  }
};
