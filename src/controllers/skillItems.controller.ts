import type { RequestHandler } from "express";
import { db } from "../db/index.js";
import { skillItems } from "../db/schema.js";

export const getAllSkillItems: RequestHandler = async (_req, res) => {
  try {
    const allSkillitems = await db.select().from(skillItems);
    res.status(200).json(allSkillitems);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erreur lors de la récupération des éléments de compétence",
    });
  }
};
