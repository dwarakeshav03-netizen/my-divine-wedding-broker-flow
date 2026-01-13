import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { initializeDatabase, closeDatabase } from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import connectionRoutes from "./routes/connectionRoutes.js";
import { authenticateToken, authorizeRole, errorHandler } from "./middleware/auth.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { runMigrations } from "../migrations/run.js";
import eventRoutes from "./routes/eventRoutes.js";
import successStoriesRoutes from "./routes/successStoriesRoutes.js";
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============ CORS MIDDLEWARE ============
app.use(cors({
  origin: ["http://localhost:3000"], 
  methods: ["GET", "POST", "PUT", "DELETE"], 
  allowedHeaders: ["Content-Type", "Authorization"], 
}));

// ============ SECURITY MIDDLEWARE ============
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } 
}));

// ============ UPLOADING ============
app.use('/uploads', express.static('uploads'));


// ============ BODY PARSING ============
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ============ LOGGING ============
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

// ============ RATE LIMITING ============
app.use("/api/", apiLimiter);

// ============ HEALTH CHECK ============
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});


// ============ API ROUTES ============
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profiles", profileRoutes);
app.use("/api/v1/connections", connectionRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/success-stories", successStoriesRoutes);
app.use("/api/v1/users", userRoutes);

// ============ 404 HANDLER ============
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ============ ERROR HANDLER ============
app.use(errorHandler);

// ============ SERVER STARTUP ============
const startServer = async () => {
  try {
    // Initialize database and run migrations
    console.log("📦 Initializing database...");
    await initializeDatabase();

    console.log("🔄 Running migrations...");
    await runMigrations();

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`\n✅ Server started successfully on port ${PORT}`);
      console.log(`📍 API Base URL: http://localhost:${PORT}/api/v1`);
      console.log(`🔐 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🛡️  Security: HTTPS headers enabled`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log("\n🛑 Shutting down gracefully...");
      server.close(async () => {
        await closeDatabase();
        console.log("✓ Server closed");
        process.exit(0);
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};



// Start the server
startServer();

export default app;
