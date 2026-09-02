import express from "express";
import cors from "cors";
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

import { notFoundHandler, errorHandler } from "./middleware/index.js";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Resume Back API is running" });
});

app.use("/images", express.static(path.join(process.cwd(), "public/images")));
app.use("/svg", express.static(path.join(process.cwd(), "public/svg")));

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

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
