import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Extrait le token du format "Bearer <TOKEN>"

  if (!token) {
    return res.status(401).json({ error: "Accès refusé. Jeton manquant." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next(); // Laisse passer la requête vers le contrôleur
  } catch (error) {
    return res.status(403).json({ error: "Jeton invalide ou expiré." });
  }
};
