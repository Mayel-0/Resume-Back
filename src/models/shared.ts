import { z } from "zod";

// Messages d'erreur de validation en français
z.config(z.locales.fr());

/** Identifiant passé dans l'URL (`/projects/:id`) ou dans un formulaire. */
export const idSchema = z.coerce.number().int().positive();

/** Position d'affichage. Les formulaires l'envoient parfois en texte. */
export const orderSchema = z.coerce.number().int().min(0);

/**
 * Schéma de modification à partir d'un schéma de création : tous les champs
 * deviennent facultatifs, mais il en faut au moins un.
 */
export function toUpdateSchema<Shape extends z.ZodRawShape>(schema: z.ZodObject<Shape>) {
  return schema
    .partial()
    .refine((data) => Object.keys(data).length > 0, { message: "Aucun champ à modifier" });
}
