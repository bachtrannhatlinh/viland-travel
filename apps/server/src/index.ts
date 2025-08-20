import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import { supabaseService } from "./config/supabase";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFoundHandler";

// Import routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import tourRoutes from "./routes/tour.routes";
import flightRoutes from "./routes/flight.routes";
import hotelRoutes from "./routes/hotel.routes";
import carRentalRoutes from "./routes/carRental.routes";
import driverRoutes from "./routes/driver.routes";
import bookingRoutes from "./routes/booking.routes";
import paymentRoutes from "./routes/payment.routes";
import uploadRoutes from "./routes/upload.routes";
import newsRoutes from "./routes/news.routes";
import contactRoutes from "./routes/contact.routes";

// Load environment variables
dotenv.config({ path: __dirname + "/../.env" });

const app = express();
const PORT = process.env.PORT || 5000;

/* ------------------ CORS ------------------ */


// --- CORS config refactor ---
const allowedOrigins = {
  production: [
    "https://viland-travel-production.up.railway.app",
    "http://viland-travel-production.up.railway.app",
    "https://viland-travel-user.vercel.app",
    "http://localhost:3000"
  ],
  development: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "https://localhost:3000",
    "https://localhost:3001",
    "https://127.0.0.1:3000",
  ]
};

function getAllowedOrigins() {
  const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
  return allowedOrigins[env];
}

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    const allowed = getAllowedOrigins();
    if (!origin) {
      // Preflight or server-to-server: allow first allowed origin (never '*')
      return callback(null, allowed[0]);
    }
    if (allowed.includes(origin)) {
      return callback(null, origin);
    }
    console.log("CORS blocked origin:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
// Đảm bảo mọi OPTIONS trả về 200 và header CORS, không redirect
app.options("*", cors(corsOptions), (req, res) => {
  const allowed = getAllowedOrigins();
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin && allowed.includes(req.headers.origin) ? req.headers.origin : allowed[0]);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.sendStatus(200);
});

/* ------------------ Security & Utils ------------------ */
app.use(helmet());

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 phút
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
  message: { error: "Too many requests from this IP, please try again later." },
});
app.use("/api/", limiter);

app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

/* ------------------ Health check ------------------ */
app.get("/health", async (req: Request, res: Response) => {
  try {
    await supabaseService.initializeDatabase();

    res.status(200).json({
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || "1.0.0",
      database: "Supabase connected",
      services: {
        supabase: "connected",
        payment: "available",
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      timestamp: new Date().toISOString(),
      error: "Database connection failed",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/* ------------------ API Routes ------------------ */
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tours", tourRoutes);
app.use("/api/v1/flights", flightRoutes);
app.use("/api/v1/hotels", hotelRoutes);
app.use("/api/v1/car-rental", carRentalRoutes);
app.use("/api/v1/drivers", driverRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/payments", paymentRoutes);

app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/news", newsRoutes);
app.use("/api/v1/contact", contactRoutes);

/* ------------------ Error Handling ------------------ */

// Fallback CORS header cho mọi response (kể cả lỗi, 404)
app.use((req, res, next) => {
  const allowed = getAllowedOrigins();
  const origin = req.headers.origin;
  const allowOrigin = origin && allowed.includes(origin) ? origin : allowed[0];
  res.header('Access-Control-Allow-Origin', allowOrigin);
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');
  next();
});

app.use(notFoundHandler);
app.use(errorHandler);

/* ------------------ Start Server ------------------ */
const startServer = async () => {
  try {
    await supabaseService.initializeDatabase();

    app.listen(PORT, () => {
      console.log('test port')
      console.log(`🚀 ViLand Travel API Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

/* ------------------ Process Signals ------------------ */
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("📴 SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("📴 SIGINT received, shutting down gracefully");
  process.exit(0);
});

if (require.main === module) {
  startServer();
}

export default app;
