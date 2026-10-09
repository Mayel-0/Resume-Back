import { createInsertSchema } from "drizzle-zod";
import { skillCategories } from "../db/schema.js";
import { orderSchema, toUpdateSchema } from "./shared.js";

// Catégorie de compétences (Langages, Front-end…)
export type SkillCategory = typeof skillCategories.$inferSelect;
export type NewSkillCategory = typeof skillCategories.$inferInsert;

export const createSkillCategorySchema = createInsertSchema(skillCategories, {
  order: orderSchema,
}).omit({ id: true });

export const updateSkillCategorySchema = toUpdateSchema(createSkillCategorySchema);
