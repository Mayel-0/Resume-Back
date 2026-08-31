import { db } from "../db/index.js";
import { profile } from "../db/schema.ts";

export const getProfil = async (req, res) => {
  try {
    const profilData = await db.select().from(profile);
    res.status(200).json(profilData);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération du profil" });
  }
};
