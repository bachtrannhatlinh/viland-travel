import jwt, { SignOptions } from 'jsonwebtoken';
import { IUser } from '../models/User.model';

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

interface RefreshTokenPayload {
  id: string;
  type: string;
}

export const generateTokens = (user: IUser) => {
  const payload: TokenPayload = {
    id: user._id,
    email: user.email,
    role: user.role
  };

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );

  const refreshToken = jwt.sign(
    { id: user._id, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: '30d' }
  );

  return {
    accessToken,
    refreshToken
  };
};

export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error('Access token verification failed:', error);
    return null;
  }
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as RefreshTokenPayload;
    return decoded;
  } catch (error) {
    console.error('Refresh token verification failed:', error);
    return null;
  }
};

export const extractTokenFromHeader = (authHeader: string): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
};
