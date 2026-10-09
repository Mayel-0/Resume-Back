import type { AdminTokenPayload } from "../models/admin.js";

// Ajoute `req.admin`, posé par le middleware verifyToken
declare global {
  namespace Express {
    interface Request {
      admin?: AdminTokenPayload;
    }
  }
}

export {};
