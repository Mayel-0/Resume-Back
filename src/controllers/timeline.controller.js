import { db } from "../db/index.js";
import { timeline } from "../db/schema.ts";

export const getAllTimeline = async (req, res) => {
  try {
    const allTimeline = await db.select().from(timeline);
    res.status(200).json(allTimeline);
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la récupération des éléments de la timeline",
    });
  }
};
