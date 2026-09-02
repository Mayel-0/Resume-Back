import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

// ─── Enums ───────────────────────────────────────────────────
export const visibilityEnum = pgEnum("visibility", ["Public", "Privé"]);

// ─── Profile ─────────────────────────────────────────────────
// Données fixes de présentation (une seule ligne)
export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  role: varchar("role", { length: 200 }).notNull(),
  location: varchar("location", { length: 100 }),
  tagline: text("tagline"),
  portraitUrl: varchar("portrait_url", { length: 500 }),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── Sections (À propos, Parcours…) ──────────────────────────
export const sections = pgTable("sections", {
  id: serial("id").primaryKey(),
  sectionId: varchar("section_id", { length: 50 }).notNull().unique(), // "apropos", "parcours"…
  index: varchar("index", { length: 5 }), // "01", "02"…
  title: varchar("title", { length: 100 }).notNull(),
  html: text("html").notNull(),
  order: integer("order").notNull(),
});

// ─── Timeline ────────────────────────────────────────────────
export const timeline = pgTable("timeline", {
  id: serial("id").primaryKey(),
  period: varchar("period", { length: 100 }).notNull(),
  title: varchar("title", { length: 100 }).notNull(),
  subtitle: varchar("subtitle", { length: 200 }),
  text: text("text"),
  order: integer("order").notNull(),
});

// ─── Skill categories ────────────────────────────────────────
export const skillCategories = pgTable("skill_categories", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  order: integer("order").notNull(),
});

export const skillItems = pgTable("skill_items", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id")
    .references(() => skillCategories.id)
    .notNull(),
  label: varchar("label", { length: 100 }).notNull(),
  order: integer("order").notNull(),
});

// ─── Social links ─────────────────────────────────────────────
export const socials = pgTable("socials", {
  id: serial("id").primaryKey(),
  label: varchar("label", { length: 50 }).notNull(),
  handle: varchar("handle", { length: 100 }),
  href: varchar("href", { length: 500 }).notNull(),
  icon: varchar("icon", { length: 50 }),
  order: integer("order").notNull(),
  path: text("path"),
  viewbox: text("viewbox"),
});

// ─── Projects ─────────────────────────────────────────────────
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(), // "eldoria", "cloud-perso"…
  title: varchar("title", { length: 200 }).notNull(),
  imageUrl: varchar("image_url", { length: 500 }), // chemin ou URL
  year: varchar("year", { length: 50 }), // "Ynov B1", "Perso"…
  visibility: visibilityEnum("visibility").default("Public"),
  intro: text("intro"),
  contextTitle: varchar("context_title", { length: 100 }),
  context: text("context"),
  readme: text("readme"),
  note: text("note"),
  githubUrl: varchar("github_url", { length: 500 }),
  liveUrl: varchar("live_url", { length: 500 }),
  linkLabel: varchar("link_label", { length: 100 }),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Project tags ─────────────────────────────────────────────
export const projectTags = pgTable("project_tags", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .references(() => projects.id)
    .notNull(),
  tag: varchar("tag", { length: 50 }).notNull(),
});

// ─── Project languages & frameworks ───────────────────────────
export const projectTechStack = pgTable("project_tech_stack", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .references(() => projects.id)
    .notNull(),
  label: varchar("label", { length: 100 }).notNull(),
  type: varchar("type", { length: 20 }).notNull(), // "language" | "framework"
});
