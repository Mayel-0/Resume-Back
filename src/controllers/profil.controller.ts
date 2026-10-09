import type { RequestHandler } from "express";
import { db } from "../db/index.js";
import { profile } from "../db/schema.js";

export const getProfil: RequestHandler = async (_req, res) => {
  try {
    const profilData = await db.select().from(profile);
    res.status(200).json(profilData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération du profil" });
  }
};
