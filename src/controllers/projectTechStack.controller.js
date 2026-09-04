import { db } from "../db/index.js";
import { projectTechStack } from "../db/schema.js";

export const getAllProjectTechStack = async (req, res) => {
  try {
    const allProjectTechStack = await db.select().from(projectTechStack);
    res.status(200).json(allProjectTechStack);
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la récupération des tech stacks de projet",
    });
  }
};
