import { createInsertSchema } from "drizzle-zod";
import { profile } from "../db/schema.js";
import { toUpdateSchema } from "./shared.js";

// Présentation du hero. Une seule ligne en base.
export type Profile = typeof profile.$inferSelect;
export type NewProfile = typeof profile.$inferInsert;

export const createProfileSchema = createInsertSchema(profile).omit({
  id: true,
  updatedAt: true,
});

export const updateProfileSchema = toUpdateSchema(createProfileSchema);
