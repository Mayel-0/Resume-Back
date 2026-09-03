// Middleware pour les routes inexistantes (404)
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({ error: "Route non trouvée" });
};

// Middleware global de gestion des erreurs (500)
export const errorHandler = (err, req, res, next) => {
  console.error("Erreur serveur :", err.stack);
  res.status(500).json({ error: "Une erreur interne est survenue" });
};
