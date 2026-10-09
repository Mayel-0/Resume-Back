import { createInsertSchema } from "drizzle-zod";
import { briefs } from "../db/schema.js";
import { orderSchema, toUpdateSchema } from "./shared.js";

// Ligne du bloc « En bref » (titre + valeur)
export type Brief = typeof briefs.$inferSelect;
export type NewBrief = typeof briefs.$inferInsert;

export const createBriefSchema = createInsertSchema(briefs, {
  order: orderSchema,
}).omit({ id: true });

export const updateBriefSchema = toUpdateSchema(createBriefSchema);
