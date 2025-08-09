import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { connectDatabase } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import tourRoutes from './routes/tour.routes';
import flightRoutes from './routes/flight.routes';
import hotelRoutes from './routes/hotel.routes';
import carRentalRoutes from './routes/carRental.routes';
import driverRoutes from './routes/driver.routes';
import bookingRoutes from './routes/booking.routes';
import paymentRoutes from './routes/payment.routes';
import uploadRoutes from './routes/upload.routes';

// Load environment variables
dotenv.config({ path: __dirname + '/../.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://gosafe.vn', 'https://www.gosafe.vn']
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/flights', flightRoutes);
app.use('/api/v1/hotels', hotelRoutes);
app.use('/api/v1/car-rental', carRentalRoutes);
app.use('/api/v1/drivers', driverRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/upload', uploadRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Database connection and server startup
const startServer = async () => {
  try {
    await connectDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 GoSafe API Server is running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT received, shutting down gracefully');
  process.exit(0);
});

if (require.main === module) {
  startServer();
}

export default app;
