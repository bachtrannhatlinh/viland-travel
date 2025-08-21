import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/postgresql';
import { User } from '../entities/User.entity';

interface AuthenticatedRequest extends Request {
  user?: any;
}

const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    let token: string | undefined;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check for token in cookies
    if (!token && req.headers.cookie) {
      const cookies = req.headers.cookie.split(';');
      const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
      if (tokenCookie) {
        token = tokenCookie.split('=')[1];
      }
    }


    if (!token) {
      console.warn('[AUTH] No token provided');
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Log token for debugging
    console.log('[AUTH] Received token:', token);

    try {
      // Verify token
      const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
      const decoded = jwt.verify(token, jwtSecret);
      // Gán thông tin user từ token vào req.user
      req.user = decoded;
      next();
    } catch (tokenError) {
      console.error('[AUTH] Token verify error:', tokenError);
      res.status(401).json({
        success: false,
        error: {
          message: 'Invalid token',
          details: tokenError instanceof Error ? tokenError.message : tokenError
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Authentication middleware error'
      }
    });
  }
};

const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Authentication required'
        }
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: {
          message: `Access denied. Required role: ${roles.join(' or ')}`
        }
      });
      return;
    }

    next();
  };
};

export { protect, authorize, AuthenticatedRequest };
