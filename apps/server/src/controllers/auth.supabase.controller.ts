import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { supabaseAuthService } from '../services/supabase.service';
import { sendEmail } from '../services/email.service';
import jwt, { Secret } from 'jsonwebtoken';

// Register user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      });
      return;
    }
    const { firstName, lastName, email, password, phone } = req.body;
    const { data: user, error } = await supabaseAuthService.registerUser({ firstName, lastName, email, password, phone });
    if (error) {
      console.error('Supabase register error:', error);
      res.status(400).json({
        success: false,
        error: { message: error.message || 'Registration failed' }
      });
      return;
    }
    // Gửi email xác thực nếu cần
    res.status(201).json({
      success: true,
      data: { user },
      message: 'User registered successfully. Please check your email to verify your account.'
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error during registration', details: error }
    });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      });
      return;
    }
    const { email, password } = req.body;
    const { data: user, error } = await supabaseAuthService.loginUser({ email, password });
    if (error) {
      res.status(401).json({
        success: false,
        error: { message: error.message || 'Invalid email or password' }
      });
      return;
    }
    // Tạo access token
    const secret: Secret = process.env.JWT_SECRET || 'your_jwt_secret';
    const expiresIn: string | number | undefined = process.env.JWT_EXPIRES_IN || '7d';
    const token = jwt.sign(
      { id: user?.id, email: user?.email },
      secret,
      { expiresIn: expiresIn as any }
    );
    res.status(200).json({
      success: true,
      data: { user, token },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error during login' }
    });
  }
};

// Get current user profile
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: { message: 'User not authenticated' }
      });
      return;
    }
    const { data: user, error } = await supabaseAuthService.getUserProfile(userId);
    if (error || !user) {
      res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
};

// Logout user
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Nếu có logic logout với Supabase thì gọi, nếu không chỉ trả về thành công
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error during logout' }
    });
  }
};

// Refresh token (placeholder)
import { verifyRefreshToken, generateTokens } from '../utils/tokenUtils';

export const refreshToken = async (req: Request, res: Response) => {
  try {
    // Lấy refresh token từ body hoặc header
    const refreshToken = req.body.refreshToken || req.headers['x-refresh-token'] || req.headers['authorization']?.replace('Bearer ', '');
    if (!refreshToken) {
      res.status(400).json({ success: false, message: 'Missing refresh token' });
      return;
    }

    // Xác thực refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded || !decoded.id) {
      res.status(401).json({ success: false, message: 'Invalid refresh token' });
      return;
    }

    // Lấy user từ DB
    const { data: user, error } = await supabaseAuthService.getUserProfile(decoded.id);
    if (error || !user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Kiểm tra refresh token có trong DB không
    const tokens = user.refresh_tokens || [];
    if (!tokens.includes(refreshToken)) {
      res.status(401).json({ success: false, message: 'Refresh token not recognized' });
      return;
    }

    // Sinh token mới
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    // Cập nhật refresh_tokens: xóa token cũ, thêm token mới
    const updatedTokens = tokens.filter((t: string) => t !== refreshToken);
    updatedTokens.push(newRefreshToken);
    const { error: updateError } = await supabaseAuthService.updateUserRefreshTokens(user.id, updatedTokens);
    if (updateError) {
      res.status(500).json({ success: false, message: 'Failed to update refresh tokens' });
      return;
    }

    res.status(200).json({
      success: true,
      accessToken,
      refreshToken: newRefreshToken
    });
    return;
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error });
  }
};

// Forgot password (placeholder)
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
};

// Reset password (placeholder)
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
};

// Verify email (placeholder)
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
};

// Resend verification email (placeholder)
export const resendVerificationEmail = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
};

// Update profile (placeholder)
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
};

// Change password (placeholder)
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: 'Not implemented yet' });
};