import { Router } from "express";
import { eq } from "drizzle-orm";
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
  briefs,
} from "../db/schema.js";
import { crudRoutes } from "../lib/crud.js";
import { sendError } from "../lib/http.js";
import {
  createBriefSchema,
  createProfileSchema,
  createProjectSchema,
  createProjectTagSchema,
  createProjectTechStackSchema,
  createSectionSchema,
  createSkillCategorySchema,
  createSkillItemSchema,
  createSocialSchema,
  createTimelineItemSchema,
  updateBriefSchema,
  updateProfileSchema,
  updateProjectSchema,
  updateProjectTagSchema,
  updateProjectTechStackSchema,
  updateSectionSchema,
  updateSkillCategorySchema,
  updateSkillItemSchema,
  updateSocialSchema,
  updateTimelineItemSchema,
} from "../models/index.js";

const router = Router();

// Tout ce qui suit demande d'être connecté
router.use(verifyToken);

// ── Profile ───────────────────────────────────────────────
// Une seule ligne : pas de création ni de suppression, le PATCH
// crée le profil s'il n'existe pas encore.
router.get("/profil", async (_req, res) => {
  const rows = await db.select().from(profile);
  res.json(rows[0] ?? null);
});

router.patch("/profil", async (req, res) => {
  try {
    const rows = await db.select().from(profile);
    const existing = rows[0];

    if (!existing) {
      const [inserted] = await db
        .insert(profile)
        .values(createProfileSchema.parse(req.body))
        .returning();
      res.json(inserted);
      return;
    }

    const [updated] = await db
      .update(profile)
      .set({ ...updateProfileSchema.parse(req.body), updatedAt: new Date() })
      .where(eq(profile.id, existing.id))
      .returning();

    res.json(updated);
  } catch (error) {
    sendError(res, error, "Erreur lors de la mise à jour du profil");
  }
});

// ── Sections ──────────────────────────────────────────────
router.use(
  crudRoutes({
    path: "/sections",
    label: "de la section",
    createSchema: createSectionSchema,
    updateSchema: updateSectionSchema,
    list: () => db.select().from(sections).orderBy(sections.order),
    create: (data) => db.insert(sections).values(data).returning(),
    update: (id, data) => db.update(sections).set(data).where(eq(sections.id, id)).returning(),
    remove: (id) => db.delete(sections).where(eq(sections.id, id)),
  }),
);

// ── Timeline ──────────────────────────────────────────────
router.use(
  crudRoutes({
    path: "/timeline",
    label: "de l'étape du parcours",
    createSchema: createTimelineItemSchema,
    updateSchema: updateTimelineItemSchema,
    list: () => db.select().from(timeline).orderBy(timeline.order),
    create: (data) => db.insert(timeline).values(data).returning(),
    update: (id, data) => db.update(timeline).set(data).where(eq(timeline.id, id)).returning(),
    remove: (id) => db.delete(timeline).where(eq(timeline.id, id)),
  }),
);

// ── Briefs ────────────────────────────────────────────────
router.use(
  crudRoutes({
    path: "/briefs",
    label: "du brief",
    createSchema: createBriefSchema,
    updateSchema: updateBriefSchema,
    list: () => db.select().from(briefs).orderBy(briefs.order),
    create: (data) => db.insert(briefs).values(data).returning(),
    update: (id, data) => db.update(briefs).set(data).where(eq(briefs.id, id)).returning(),
    remove: (id) => db.delete(briefs).where(eq(briefs.id, id)),
  }),
);

// ── Socials ───────────────────────────────────────────────
router.use(
  crudRoutes({
    path: "/socials",
    label: "du réseau social",
    createSchema: createSocialSchema,
    updateSchema: updateSocialSchema,
    list: () => db.select().from(socials).orderBy(socials.order),
    create: (data) => db.insert(socials).values(data).returning(),
    update: (id, data) => db.update(socials).set(data).where(eq(socials.id, id)).returning(),
    remove: (id) => db.delete(socials).where(eq(socials.id, id)),
  }),
);

// ── Skill categories ──────────────────────────────────────
router.use(
  crudRoutes({
    path: "/skill-categories",
    label: "de la catégorie",
    createSchema: createSkillCategorySchema,
    updateSchema: updateSkillCategorySchema,
    list: () => db.select().from(skillCategories).orderBy(skillCategories.order),
    create: (data) => db.insert(skillCategories).values(data).returning(),
    update: (id, data) =>
      db.update(skillCategories).set(data).where(eq(skillCategories.id, id)).returning(),
    remove: (id) => db.delete(skillCategories).where(eq(skillCategories.id, id)),
  }),
);

// ── Skill items ───────────────────────────────────────────
router.use(
  crudRoutes({
    path: "/skill-items",
    label: "de la compétence",
    createSchema: createSkillItemSchema,
    updateSchema: updateSkillItemSchema,
    list: () => db.select().from(skillItems),
    create: (data) => db.insert(skillItems).values(data).returning(),
    update: (id, data) => db.update(skillItems).set(data).where(eq(skillItems.id, id)).returning(),
    remove: (id) => db.delete(skillItems).where(eq(skillItems.id, id)),
  }),
);

// ── Projects ──────────────────────────────────────────────
router.use(
  crudRoutes({
    path: "/projects",
    label: "du projet",
    createSchema: createProjectSchema,
    updateSchema: updateProjectSchema,
    list: () => db.select().from(projects).orderBy(projects.order),
    create: (data) => db.insert(projects).values(data).returning(),
    update: (id, data) => db.update(projects).set(data).where(eq(projects.id, id)).returning(),
    remove: (id) => db.delete(projects).where(eq(projects.id, id)),
  }),
);

// ── Project tags ──────────────────────────────────────────
router.use(
  crudRoutes({
    path: "/project-tags",
    label: "du tag",
    createSchema: createProjectTagSchema,
    updateSchema: updateProjectTagSchema,
    list: () => db.select().from(projectTags),
    create: (data) => db.insert(projectTags).values(data).returning(),
    update: (id, data) => db.update(projectTags).set(data).where(eq(projectTags.id, id)).returning(),
    remove: (id) => db.delete(projectTags).where(eq(projectTags.id, id)),
  }),
);

// ── Project tech stack ────────────────────────────────────
router.use(
  crudRoutes({
    path: "/project-tech-stack",
    label: "de la technologie",
    createSchema: createProjectTechStackSchema,
    updateSchema: updateProjectTechStackSchema,
    list: () => db.select().from(projectTechStack),
    create: (data) => db.insert(projectTechStack).values(data).returning(),
    update: (id, data) =>
      db.update(projectTechStack).set(data).where(eq(projectTechStack.id, id)).returning(),
    remove: (id) => db.delete(projectTechStack).where(eq(projectTechStack.id, id)),
  }),
);

export default router;
