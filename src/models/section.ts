import { createInsertSchema } from "drizzle-zod";
import { sections } from "../db/schema.js";
import { orderSchema, toUpdateSchema } from "./shared.js";

// Bloc de texte libre affiché dans « Parcours » (HTML saisi dans le backoffice)
export type Section = typeof sections.$inferSelect;
export type NewSection = typeof sections.$inferInsert;

export const createSectionSchema = createInsertSchema(sections, {
  order: orderSchema,
}).omit({ id: true });

export const updateSectionSchema = toUpdateSchema(createSectionSchema);
