import express from "express";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import tvRoutes from "./routes/tv.route.js";
import searchRoutes from "./routes/search.route.js";

import { ENV_VARS } from "./config/envVars.js";
import { connectDB } from "./config/db.js";
import { protectRoute } from "./middleware/protectRoute.js";

const app = express();
const PORT = ENV_VARS.PORT || 5000;
const __dirname = path.resolve();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movie", protectRoute, movieRoutes);
app.use("/api/v1/tv", protectRoute, tvRoutes);
app.use("/api/v1/search", protectRoute, searchRoutes);

// Serve frontend in production
if (ENV_VARS.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  );
}

async function startServer() {
  try {
    // 1) Connect to MongoDB first
    await connectDB({
      // if your connectDB helper takes options, ensure you pass the IPv4-only URI
      uri:
        process.env.MONGO_URI ||
        "mongodb://127.0.0.1:27017/netflix-clone",
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    });
    console.log("✅ MongoDB connected");

    // 2) Only then start listening
    app.listen(PORT, () => {
      console.log(`🚀 Server started at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1); // crash process so you can catch it in your process manager
  }
}

startServer();
