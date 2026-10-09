import { createInsertSchema } from "drizzle-zod";
import { projectTags } from "../db/schema.js";
import { idSchema, toUpdateSchema } from "./shared.js";

// Étiquette affichée sur un projet
export type ProjectTag = typeof projectTags.$inferSelect;
export type NewProjectTag = typeof projectTags.$inferInsert;

export const createProjectTagSchema = createInsertSchema(projectTags, {
  projectId: idSchema,
}).omit({ id: true });

export const updateProjectTagSchema = toUpdateSchema(
  // Une étiquette ne change pas de projet : seul son texte se modifie
  createProjectTagSchema.omit({ projectId: true }),
);
