import { db } from "../db/index.js";
import { sections } from "../db/schema.js";

export const getAllSections = async (req, res) => {
  try {
    const allSections = await db.select().from(sections);
    res.status(200).json(allSections);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des sections" });
  }
};
