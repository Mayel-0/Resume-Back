import type { RequestHandler } from "express";
import { db } from "../db/index.js";
import { skillCategories } from "../db/schema.js";

export const getAllSkillCategories: RequestHandler = async (_req, res) => {
  try {
    const allSkillCategories = await db.select().from(skillCategories);
    res.status(200).json(allSkillCategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erreur lors de la récupération des catégories de compétences",
    });
  }
};
