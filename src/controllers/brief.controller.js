import { db } from "../db/index.js";
import { briefs } from "../db/schema.js";

export const getAllBriefs = async (req, res) => {
  try {
    const allBriefs = await db.select().from(briefs).orderBy(briefs.order);
    res.status(200).json(allBriefs);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des briefs" });
  }
};
