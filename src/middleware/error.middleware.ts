import type { ErrorRequestHandler, RequestHandler } from "express";

// Middleware pour les routes inexistantes (404)
export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ error: "Route non trouvée" });
};

// Middleware global de gestion des erreurs (500).
// Express reconnaît un gestionnaire d'erreurs à ses 4 paramètres.
export const errorHandler: ErrorRequestHandler = (err: unknown, _req, res, _next) => {
  console.error("Erreur serveur :", err instanceof Error ? err.stack : err);
  res.status(500).json({ error: "Une erreur interne est survenue" });
};
