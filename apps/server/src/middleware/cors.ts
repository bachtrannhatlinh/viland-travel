import { Request, Response, NextFunction } from 'express';

// CORS Middleware
export const setCorsHeaders = (req: Request, res: Response): void => {
  const allowedOrigins = [
    'https://gosafe-booking-tour.vercel.app',
    'https://www.gosafe-booking-tour.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000'
  ];
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]); // fallback
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
};

export const handleCors = (req: Request, res: Response, next?: NextFunction): void => {
  setCorsHeaders(req, res);

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (next) next();
};