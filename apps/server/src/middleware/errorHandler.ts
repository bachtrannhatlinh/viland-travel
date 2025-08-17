import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Set default error values
  let error = { ...err };
  error.message = err.message;

  // Default to 500 server error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    message = 'Resource not found';
    statusCode = 404;
  }

  // Mongoose duplicate key
  if (err.name === 'MongoError' && (err as any).code === 11000) {
    message = 'Duplicate field value entered';
    statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values((err as any).errors).map((val: any) => val.message);
    message = `Invalid input data: ${errors.join(', ')}`;
    statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token';
    statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    message = 'Token expired';
    statusCode = 401;
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Details:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
      statusCode,
    });
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
        details: err
      })
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  });
};

export { errorHandler };
