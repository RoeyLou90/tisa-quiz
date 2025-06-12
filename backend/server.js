require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});
app.use("/api/", limiter);

// CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL
      : "http://localhost:8080",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Logging
app.use(morgan("dev"));

// Parse JSON bodies
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Cache for questions
let questionsCache = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Question validation
function validateQuestion(question) {
  return (
    question.id &&
    typeof question.text === "string" &&
    Array.isArray(question.options) &&
    question.options.every(
      (opt) =>
        opt.id && typeof opt.text === "string" && typeof opt.scores === "object"
    )
  );
}

// Load questions with caching
function loadQuestions() {
  const now = Date.now();
  if (questionsCache && now - cacheTimestamp < CACHE_TTL) {
    return questionsCache;
  }

  const questionsPath = path.join(__dirname, "../api/questions/data.json");
  console.log(`Loading questions from: ${questionsPath}`);

  try {
    if (!fs.existsSync(questionsPath)) {
      throw new Error(`Questions file not found at: ${questionsPath}`);
    }

    const fileContent = fs.readFileSync(questionsPath, "utf8");
    const questions = JSON.parse(fileContent);

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Questions data is empty");
    }

    if (!questions.every(validateQuestion)) {
      throw new Error("Invalid question format in data.json");
    }

    questionsCache = questions;
    cacheTimestamp = now;
    console.log(`Successfully loaded ${questions.length} questions`);
    return questions;
  } catch (error) {
    console.error("Error loading questions:", error);
    throw error;
  }
}

// API route for questions
app.get("/api/questions", async (req, res) => {
  try {
    const questions = loadQuestions();
    res.json(questions);
  } catch (error) {
    console.error("[ERROR] Failed to load questions:", error);
    res.status(500).json({
      error: "Failed to load questions",
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    });
  }
});

// Serve static files from frontend in production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");

  if (fs.existsSync(frontendPath)) {
    console.log(`Serving static files from: ${frontendPath}`);
    app.use(express.static(frontendPath));

    // Handle SPA fallback
    app.get("*", (req, res) => {
      res.sendFile(path.join(frontendPath, "index.html"));
    });
  } else {
    console.warn(`Frontend build not found at: ${frontendPath}`);
  }
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`\n=== Server is running on http://localhost:${PORT} ===`);
  console.log(`API Endpoint: http://localhost:${PORT}/api/questions\n`);
  console.log("Environment:", process.env.NODE_ENV || "development");
  console.log("Current working directory:", process.cwd());
  console.log("__dirname:", __dirname);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Consider shutting down the server in production
  // server.close(() => process.exit(1));
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  // Consider shutting down the server in production
  // server.close(() => process.exit(1));
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});
