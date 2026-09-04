import { db } from "../db/index.js";
import { socials } from "../db/schema.js";

export const getAllSocials = async (req, res) => {
  try {
    const allSocials = await db.select().from(socials);
    res.status(200).json(allSocials);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des réseaux sociaux" });
  }
};
