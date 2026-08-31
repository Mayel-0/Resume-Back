import { db } from "../db/index.js";
import { skillCategories } from "../db/schema.ts";

export const getAllSkillCategories = async (req, res) => {
  try {
    const allSkillCategories = await db.select().from(skillCategories);
    res.status(200).json(allSkillCategories);
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la récupération des catégories de compétences",
    });
  }
};
