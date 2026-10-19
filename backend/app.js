require("dotenv").config();

const express = require("express");
const cors = require("cors");

const logger = require("./middleware/logger");
const validateContentType = require("./middleware/validateContentType");
const errorHandler = require("./middleware/errorHandler");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
const { protect } = require("./middleware/authMiddleware");

const app = express();

// ---- Core middleware ----
app.use(cors());
app.use(express.json());
app.use(logger);
app.use(validateContentType);

// ---- Routes ----
app.get("/", (req, res) => {
  res.json({ message: "Task Manager API is running", docs: "/api/tasks" });
});

// Auth routes (public)
app.use("/api/auth", authRoutes);

// Task routes (protected — requires valid JWT)
app.use("/api/tasks", protect, taskRoutes);

// ---- 404 handler for undefined routes ----
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  });
});

// ---- Global error handler (must be LAST) ----
app.use(errorHandler);

module.exports = app;
