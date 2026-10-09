import type { RequestHandler } from "express";
import { db } from "../db/index.js";
import { projectTags } from "../db/schema.js";

export const getAllProjectTags: RequestHandler = async (_req, res) => {
  try {
    const allProjectTags = await db.select().from(projectTags);
    res.status(200).json(allProjectTags);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des tags de projet" });
  }
};
