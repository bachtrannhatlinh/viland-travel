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

// Load environment variables
dotenv.config({ path: __dirname + "/../.env" });

const app = express();
const PORT = process.env.PORT || 5000;

/* ------------------ CORS ------------------ */
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (process.env.NODE_ENV === "production") {
      const allowedOrigins = [
        "https://gosafe-booking-tour.vercel.app",
        "https://www.gosafe-booking-tour.vercel.app",
        "https://server666.vercel.app",
      ];

      const isVercelApp =
        origin && (origin.endsWith(".vercel.app") || origin.includes("gosafe-booking-tour"));

      if (!origin) {
        // Cho phép preflight không có origin hoặc server-to-server
        return callback(null, "*");
      }

      if (allowedOrigins.includes(origin) || isVercelApp) {
        return callback(null, origin);
      }

      console.log("CORS blocked origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    } else {
      const devOrigins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
      ];
      if (!origin || devOrigins.includes(origin)) {
        return callback(null, origin || "*");
      }
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

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

/* ------------------ Error Handling ------------------ */
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
