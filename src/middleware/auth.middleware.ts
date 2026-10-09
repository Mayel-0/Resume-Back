import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../env.js";
import { adminTokenPayloadSchema } from "../models/index.js";

export const verifyToken: RequestHandler = (req, res, next) => {
  const token: unknown = req.cookies?.token;

  if (typeof token !== "string" || !token) {
    res.status(401).json({ error: "Accès refusé. Jeton manquant." });
    return;
  }

  try {
    // Le contenu du jeton est vérifié lui aussi : une signature valide
    // ne garantit pas la forme des données.
    req.admin = adminTokenPayloadSchema.parse(jwt.verify(token, env.JWT_SECRET));
    next();
  } catch {
    res.status(401).json({ error: "Jeton invalide ou expiré." });
  }
};
