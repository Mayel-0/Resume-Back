import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { projects, VISIBILITIES } from "../db/schema.js";
import { orderSchema, toUpdateSchema } from "./shared.js";

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Visibility = (typeof VISIBILITIES)[number];

export const createProjectSchema = createInsertSchema(projects, {
  order: orderSchema,
  // Un champ laissé vide dans le formulaire vaut "non renseigné" :
  // la base applique alors sa valeur par défaut (Public).
  visibility: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.enum(VISIBILITIES).optional(),
  ),
}).omit({ id: true, createdAt: true });

export const updateProjectSchema = toUpdateSchema(createProjectSchema);
