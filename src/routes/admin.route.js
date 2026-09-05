import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { db } from "../db/index.js";
import {
  profile,
  sections,
  timeline,
  projects,
  socials,
  skillItems,
  skillCategories,
  projectTags,
  projectTechStack,
} from "../db/schema.js";
import { eq } from "drizzle-orm";

const router = Router();

router.use(verifyToken);

//skill-categories

router.get("/skill-categories", async (req, res) => {
  const rows = await db
    .select()
    .from(skillCategories)
    .orderBy(skillCategories.order);
  res.json(rows);
});

router.patch("/skill-categories/:id", async (req, res) => {
  try {
    const updated = await db
      .update(skillCategories)
      .set(req.body)
      .where(eq(skillCategories.id, Number(req.params.id)))
      .returning();
    res.json(updated[0]);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de la section" });
  }
});

router.post("/skill-categories", async (req, res) => {
  try {
    const inserted = await db
      .insert(skillCategories)
      .values(req.body)
      .returning();
    res.status(201).json(inserted[0]);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création de la section" });
  }
});

router.delete("/skill-categories/:id", async (req, res) => {
  try {
    await db
      .delete(skillCategories)
      .where(eq(skillCategories.id, Number(req.params.id)));
    res.status(204).end();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de la section" });
  }
});

// skill-items

router.get("/skill-items", async (req, res) => {
  const rows = await db.select().from(skillItems);
  res.json(rows);
});

router.patch("/skill-items/:id", async (req, res) => {
  try {
    const updated = await db
      .update(skillItems)
      .set(req.body)
      .where(eq(skillItems.id, Number(req.params.id)))
      .returning();
    res.json(updated[0]);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de la section" });
  }
});

router.post("/skill-items", async (req, res) => {
  try {
    const inserted = await db.insert(skillItems).values(req.body).returning();
    res.status(201).json(inserted[0]);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création de la section" });
  }
});

router.delete("/skill-items/:id", async (req, res) => {
  try {
    await db.delete(skillItems).where(eq(skillItems.id, Number(req.params.id)));
    res.status(204).end();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de la section" });
  }
});

// -- Socials
router.get("/socials", async (req, res) => {
  const rows = await db.select().from(socials).orderBy(socials.order);
  res.json(rows);
});

router.patch("/socials/:id", async (req, res) => {
  try {
    const updated = await db
      .update(socials)
      .set(req.body)
      .where(eq(socials.id, Number(req.params.id)))
      .returning();
    res.json(updated[0]);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de la section" });
  }
});

router.post("/socials", async (req, res) => {
  try {
    const inserted = await db.insert(socials).values(req.body).returning();
    res.status(201).json(inserted[0]);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création de la section" });
  }
});

router.delete("/socials/:id", async (req, res) => {
  try {
    await db.delete(socials).where(eq(socials.id, Number(req.params.id)));
    res.status(204).end();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de la section" });
  }
});

// ── Profile ───────────────────────────────────────────────
router.get("/profil", async (req, res) => {
  const rows = await db.select().from(profile);
  res.json(rows[0] ?? null);
});

router.patch("/profil", async (req, res) => {
  try {
    const rows = await db.select().from(profile);
    const existing = rows[0];

    if (!existing) {
      const inserted = await db.insert(profile).values(req.body).returning();
      return res.json(inserted[0]);
    }

    const updated = await db
      .update(profile)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(profile.id, existing.id))
      .returning();

    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour du profil" });
  }
});

// ── Sections ──────────────────────────────────────────────
router.get("/sections", async (req, res) => {
  const rows = await db.select().from(sections).orderBy(sections.order);
  res.json(rows);
});

router.patch("/sections/:id", async (req, res) => {
  try {
    const updated = await db
      .update(sections)
      .set(req.body)
      .where(eq(sections.id, Number(req.params.id)))
      .returning();
    res.json(updated[0]);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de la section" });
  }
});

router.post("/sections", async (req, res) => {
  try {
    const inserted = await db.insert(sections).values(req.body).returning();
    res.status(201).json(inserted[0]);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création de la section" });
  }
});

router.delete("/sections/:id", async (req, res) => {
  try {
    await db.delete(sections).where(eq(sections.id, Number(req.params.id)));
    res.status(204).end();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de la section" });
  }
});

// ── Timeline ──────────────────────────────────────────────
router.get("/timeline", async (req, res) => {
  const rows = await db.select().from(timeline).orderBy(timeline.order);
  res.json(rows);
});

router.patch("/timeline/:id", async (req, res) => {
  try {
    const updated = await db
      .update(timeline)
      .set(req.body)
      .where(eq(timeline.id, Number(req.params.id)))
      .returning();
    res.json(updated[0]);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de la timeline" });
  }
});

router.post("/timeline", async (req, res) => {
  try {
    const inserted = await db.insert(timeline).values(req.body).returning();
    res.status(201).json(inserted[0]);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création" });
  }
});

router.delete("/timeline/:id", async (req, res) => {
  try {
    await db.delete(timeline).where(eq(timeline.id, Number(req.params.id)));
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
});

// ── Projects ──────────────────────────────────────────────
router.get("/projects", async (req, res) => {
  const rows = await db.select().from(projects).orderBy(projects.order);
  res.json(rows);
});

router.patch("/projects/:id", async (req, res) => {
  try {
    const updated = await db
      .update(projects)
      .set(req.body)
      .where(eq(projects.id, Number(req.params.id)))
      .returning();
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour du projet" });
  }
});

router.post("/projects", async (req, res) => {
  try {
    const inserted = await db
      .insert(projects)
      .values({
        ...req.body,
        order: Number(req.body.order) || 0,
      })
      .returning();

    res.status(201).json(inserted[0]);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création" });
  }
});

router.delete("/projects/:id", async (req, res) => {
  try {
    await db.delete(projects).where(eq(projects.id, Number(req.params.id)));
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression du projet" });
  }
});

// ── Project tags ─────────────────────────────────────────
router.get("/project-tags", async (req, res) => {
  const rows = await db.select().from(projectTags);
  res.json(rows);
});

router.post("/project-tags", async (req, res) => {
  try {
    const inserted = await db
      .insert(projectTags)
      .values({
        projectId: Number(req.body.projectId),
        tag: req.body.tag,
      })
      .returning();
    res.status(201).json(inserted[0]);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création du tag" });
  }
});

router.patch("/project-tags/:id", async (req, res) => {
  try {
    const updated = await db
      .update(projectTags)
      .set({ tag: req.body.tag })
      .where(eq(projectTags.id, Number(req.params.id)))
      .returning();
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour du tag" });
  }
});

router.delete("/project-tags/:id", async (req, res) => {
  try {
    await db
      .delete(projectTags)
      .where(eq(projectTags.id, Number(req.params.id)));
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression du tag" });
  }
});

// ── Project tech stack ──────────────────────────────────
router.get("/project-tech-stack", async (req, res) => {
  const rows = await db.select().from(projectTechStack);
  res.json(rows);
});

router.post("/project-tech-stack", async (req, res) => {
  try {
    const inserted = await db
      .insert(projectTechStack)
      .values({
        projectId: Number(req.body.projectId),
        label: req.body.label,
        type: req.body.type,
      })
      .returning();
    res.status(201).json(inserted[0]);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la création de la technologie" });
  }
});

router.patch("/project-tech-stack/:id", async (req, res) => {
  try {
    const updated = await db
      .update(projectTechStack)
      .set({ label: req.body.label, type: req.body.type })
      .where(eq(projectTechStack.id, Number(req.params.id)))
      .returning();
    res.json(updated[0]);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de la technologie" });
  }
});

router.delete("/project-tech-stack/:id", async (req, res) => {
  try {
    await db
      .delete(projectTechStack)
      .where(eq(projectTechStack.id, Number(req.params.id)));
    res.status(204).end();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de la technologie" });
  }
});

export default router;
