import type { RequestHandler } from "express";
import { db } from "../db/index.js";
import { timeline } from "../db/schema.js";

export const getAllTimeline: RequestHandler = async (_req, res) => {
  try {
    const allTimeline = await db
      .select()
      .from(timeline)
      .orderBy(timeline.order);
    res.status(200).json(allTimeline);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erreur lors de la récupération des éléments de la timeline",
    });
  }
};
