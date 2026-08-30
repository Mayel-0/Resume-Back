const express = require("express");
const cors = require("cors");

const apiRoutes = require("./routes");
const { notFoundHandler, errorHandler } = require("./middleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Resume Back API is running" });
});

app.use("/api", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
