import { z } from "zod";
import type { admins } from "../db/schema.js";

export type Admin = typeof admins.$inferSelect;

/** Contenu du jeton JWT stocké dans le cookie de session. */
export const adminTokenPayloadSchema = z.object({
  id: z.number().int(),
  email: z.string(),
});
export type AdminTokenPayload = z.infer<typeof adminTokenPayloadSchema>;

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const verifyOtpSchema = z.object({
  email: z.email(),
  code: z.string().min(1),
});
