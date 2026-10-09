import { createInsertSchema } from "drizzle-zod";
import { skillItems } from "../db/schema.js";
import { idSchema, orderSchema, toUpdateSchema } from "./shared.js";

// Compétence rattachée à une catégorie
export type SkillItem = typeof skillItems.$inferSelect;
export type NewSkillItem = typeof skillItems.$inferInsert;

export const createSkillItemSchema = createInsertSchema(skillItems, {
  categoryId: idSchema,
  order: orderSchema,
}).omit({ id: true });

export const updateSkillItemSchema = toUpdateSchema(createSkillItemSchema);
