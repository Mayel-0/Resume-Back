import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { projectTechStack, TECH_TYPES } from "../db/schema.js";
import { idSchema, toUpdateSchema } from "./shared.js";

// Langage ou framework utilisé sur un projet
export type ProjectTechStack = typeof projectTechStack.$inferSelect;
export type NewProjectTechStack = typeof projectTechStack.$inferInsert;
export type { TechType } from "../db/schema.js";

export const createProjectTechStackSchema = createInsertSchema(projectTechStack, {
  projectId: idSchema,
  type: z.enum(TECH_TYPES),
}).omit({ id: true });

// Un élément ne change pas de projet : seuls le nom et le type se modifient
export const updateProjectTechStackSchema = toUpdateSchema(
  createProjectTechStackSchema.omit({ projectId: true }),
);
