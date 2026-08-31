export const notFoundHandler = (req, res, next) => {
  res.status(404).json({ error: "Route non trouvée" });
};

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erreur serveur interne" });
};
