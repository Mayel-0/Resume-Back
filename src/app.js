import express from "express";
import cors from "cors";
import path from "path";

import apiRoutes from "./routes/index.js";
import projectRoutes from "./routes/projects.route.js";
import socialRoutes from "./routes/socials.route.js";
import profilRoutes from "./routes/profil.route.js";
import sectionsRoutes from "./routes/sections.route.js";
import timelineRoutes from "./routes/timeline.route.js";
import skillCategoriesRoutes from "./routes/skillCategories.route.js";
import skillItemsRoutes from "./routes/skillItems.route.js";
import projectTagsRoutes from "./routes/projectTags.route.js";
import projectTechStackRoutes from "./routes/projectTechStack.route.js";
import authRoutes from "./routes/auth.route.js";

import adminRoutes from "./routes/admin.route.js";

import {
  notFoundHandler,
  errorHandler,
} from "./middleware/error.middleware.js";

const app = express();

// ── Middlewares globaux ──────────────────────────────────────
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://mael-llado.com",
      "https://admin.mael-llado.com",
    ],
  }),
);
app.use(express.json());

// ── Routes statiques ────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Resume Back API is running" });
});
app.use("/images", express.static(path.join(process.cwd(), "public/images")));
app.use("/svg", express.static(path.join(process.cwd(), "public/svg")));

// ── Routes API ───────────────────────────────────────────────
app.use("/api/auth", authRoutes); // ← auth en premier
app.use("/api", apiRoutes);
app.use("/api", projectRoutes);
app.use("/api", socialRoutes);
app.use("/api", profilRoutes);
app.use("/api", sectionsRoutes);
app.use("/api", timelineRoutes);
app.use("/api", skillCategoriesRoutes);
app.use("/api", skillItemsRoutes);
app.use("/api", projectTagsRoutes);
app.use("/api", projectTechStackRoutes);

app.use("/api/admin", adminRoutes);

// ── Gestion d'erreurs ────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
