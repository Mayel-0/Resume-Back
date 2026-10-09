import type { Response } from "express";
import { z } from "zod";

/** Résume une erreur de validation en une phrase lisible : "titre : trop long". */
function describeValidationError(error: z.ZodError): string {
  return error.issues
    .map((issue) => {
      const field = issue.path.join(".");
      return field ? `${field} : ${issue.message}` : issue.message;
    })
    .join(" ; ");
}

/**
 * Réponse d'erreur commune : 400 si les données reçues sont invalides,
 * 500 (avec trace dans les logs) pour tout le reste.
 */
export function sendError(res: Response, error: unknown, message: string): void {
  if (error instanceof z.ZodError) {
    res.status(400).json({ error: `Données invalides — ${describeValidationError(error)}` });
    return;
  }
  console.error(error);
  res.status(500).json({ error: message });
}
