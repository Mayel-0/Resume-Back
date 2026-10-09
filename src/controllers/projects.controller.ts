import type { RequestHandler } from "express";
import { db } from "../db/index.js";
import { projects } from "../db/schema.js";

export const getAllProjects: RequestHandler = async (_req, res) => {
  try {
    const allProjects = await db.select().from(projects);
    res.status(200).json(allProjects);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des projets" });
  }
};
