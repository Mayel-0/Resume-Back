import { db } from "../db/index.js";
import { projects } from "../db/schema.ts";

export const getAllProjects = async (req, res) => {
  try {
    const allProjects = await db.select().from(projects);
    res.status(200).json(allProjects);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des projets" });
  }
};


