import { createInsertSchema } from "drizzle-zod";
import { socials } from "../db/schema.js";
import { orderSchema, toUpdateSchema } from "./shared.js";

// Lien de contact ; `path` et `viewbox` décrivent l'icône SVG
export type Social = typeof socials.$inferSelect;
export type NewSocial = typeof socials.$inferInsert;

export const createSocialSchema = createInsertSchema(socials, {
  order: orderSchema,
}).omit({ id: true });

export const updateSocialSchema = toUpdateSchema(createSocialSchema);
