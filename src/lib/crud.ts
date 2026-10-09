import { Router } from "express";
import type { z } from "zod";
import { idSchema } from "../models/index.js";
import { sendError } from "./http.js";

interface CrudOptions<Create, Update, Row> {
  /** Chemin de la ressource, ex. "/sections" */
  path: string;
  /** Complément des messages d'erreur, ex. "de la section" */
  label: string;
  createSchema: z.ZodType<Create>;
  updateSchema: z.ZodType<Update>;
  list: () => PromiseLike<Row[]>;
  create: (data: Create) => PromiseLike<Row[]>;
  update: (id: number, data: Update) => PromiseLike<Row[]>;
  remove: (id: number) => PromiseLike<unknown>;
}

/**
 * Les quatre routes d'administration d'une ressource :
 * GET /x, POST /x, PATCH /x/:id, DELETE /x/:id.
 *
 * Le corps des requêtes est validé par les schémas du modèle avant
 * d'atteindre la base : un champ inconnu est ignoré, un champ invalide
 * renvoie une erreur 400. Comme `create` et `update` reçoivent le type
 * produit par ces schémas, TypeScript vérifie qu'ils correspondent bien
 * aux colonnes de la table.
 */
export function crudRoutes<Create, Update, Row>(options: CrudOptions<Create, Update, Row>): Router {
  const { path, label, createSchema, updateSchema, list, create, update, remove } = options;
  const router = Router();

  router.get(path, async (_req, res) => {
    res.json(await list());
  });

  router.post(path, async (req, res) => {
    try {
      const [created] = await create(createSchema.parse(req.body));
      res.status(201).json(created);
    } catch (error) {
      sendError(res, error, `Erreur lors de la création ${label}`);
    }
  });

  router.patch(`${path}/:id`, async (req, res) => {
    try {
      const id = idSchema.parse(req.params.id);
      const [updated] = await update(id, updateSchema.parse(req.body));
      res.json(updated);
    } catch (error) {
      sendError(res, error, `Erreur lors de la mise à jour ${label}`);
    }
  });

  router.delete(`${path}/:id`, async (req, res) => {
    try {
      await remove(idSchema.parse(req.params.id));
      res.status(204).end();
    } catch (error) {
      sendError(res, error, `Erreur lors de la suppression ${label}`);
    }
  });

  return router;
}
